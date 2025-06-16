import joblib
import numpy as np
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from modules.models import Module
from modules.serializers import ModuleSerializer

PIPELINE_PATH = './models/cb_pipeline.joblib'
cb_pipeline = joblib.load(PIPELINE_PATH)

# unpack the pipeline
vec_sk  = cb_pipeline['vec_skills']
vec_go  = cb_pipeline['vec_goals']
dur_bins   = cb_pipeline['dur_bins']
dur_labels = cb_pipeline['dur_labels']
career_map = cb_pipeline['career_map']
sim_map    = cb_pipeline['sim_map']
weights    = cb_pipeline['weights']

# map weekly_availability to dur_labels
def availability_to_bin(hours):
    if hours <= 2:   return 'short'
    if hours <= 4:   return 'medium'
    if hours <= 6:   return 'long'
    return 'very long'

class ColdStartRecommend(APIView):
    """
    POST payload:
    {
      "career_stage": "Junior",
      "skills": ["python","django","rest"],
      "goals": ["build api","learn ml"],
      "weekly_availability": { "mon":2, "tue":1, ... }
    }
    """
    def post(self, request):
        data = request.data
        # 1) Build user textual features
        skills_txt = " ".join(data.get('skills', [])).lower()
        goals_txt  = " ".join(data.get('goals', [])).lower()

        # 2) Duration bin
        total_hours = sum(data.get('weekly_availability', {}).values())
        dur_bin = availability_to_bin(total_hours)

        # 3) Career‐level vector
        user_level = career_map.get(data['career_stage'], 'Beginner level')

        # 4) Vectorize
        u_sk = vec_sk.transform([skills_txt])
        u_go = vec_go.transform([goals_txt])
        # difficulty sim: map to all modules later
        # duration one-hot
        from sklearn.preprocessing import OneHotEncoder
        ohe = OneHotEncoder(categories=[dur_labels], handle_unknown='ignore')
        u_dur = ohe.fit_transform([[dur_bin]]).toarray()

        # 5) Gather module profiles
        modules = Module.objects.all()
        ser = ModuleSerializer(modules, many=True)
        profs = ser.data

        raw_levels = [m.get('level') for m in profs]
        clean_levels = [
            lvl if lvl in {'Beginner level', 'Intermediate level', 'Advanced level'}
            else 'Beginner level'   # fallback default
            for lvl in raw_levels
        ]

        # collect course textual arrays
        skills_list = [m['skill_tags'].lower() for m in profs]
        goals_list  = [m['goal_tags'].lower()  for m in profs]
        durations   = [m['duration'] for m in profs]
        levels      = [m['level'] for m in profs]

        # 6) Vectorize courses
        c_sk = vec_sk.transform(skills_list)
        c_go = vec_go.transform(goals_list)
        # duration bin array
        dur_bins_arr = ohe.transform([[availability_to_bin(d)] for d in durations]).toarray()
        # difficulty sim
        diff_sim = np.array([
            [sim_map[(user_level, lvl)] for lvl in clean_levels]
        ])

        # 7) Cosine similarities
        from sklearn.metrics.pairwise import cosine_similarity
        sim_sk = cosine_similarity(u_sk, c_sk)[0]
        sim_go = cosine_similarity(u_go, c_go)[0]
        sim_dur= cosine_similarity(u_dur, dur_bins_arr)[0]
        # weighted blend
        sim_combined = (
          sim_sk * weights['skills'] +
          sim_go * weights['goals'] +
          diff_sim.ravel() * weights['diff'] +
          sim_dur * weights['dur']
        )

        # 8) Pick top 10
        idx_sorted = np.argsort(-sim_combined)[:10]
        top_modules = [profs[i] for i in idx_sorted]

        return Response(top_modules, status=status.HTTP_200_OK)
