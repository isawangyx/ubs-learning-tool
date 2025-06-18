import os, django, joblib, pickle, pandas as pd
from server.lightfm import LightFM
from lightfm.data import Dataset
from lightfm.evaluation import precision_at_k, recall_at_k
from moduleprogress.models import ModuleProgress
from modules.models import Module
from django.conf import settings

# Bootstrap Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "your_project.settings")
django.setup()

# Load progress into DataFrame
qs = ModuleProgress.objects.select_related('module').values(
    'user_id', 'module__external_id',
    'ndays_act','nchapters','certified','grade'
)
df = pd.DataFrame.from_records(qs).rename(columns={'module__external_id':'course_id'})

df[['start_time_DI', 'last_event_DI']] = df[['start_time_DI', 'last_event_DI']].apply(
    pd.to_datetime, errors='coerce'
)

df['grade']     = pd.to_numeric(df['grade'], errors='coerce')
df = df.dropna(subset=['user_id', 'course_id', 'ndays_act', 'nchapters', 'certified', 'grade'])
df['certified'] = df['certified'].astype(int)
df['grade'] = df['grade'].astype(int).clip(0, 100)

# Build user features
user_stats = df.groupby('user_id').agg({
    'ndays_act':'mean',
    'nchapters':'mean'
}).reset_index().rename(columns={'ndays_act':'mean_days','nchapters':'mean_chaps'})

user_feats = [
    (row.user_id, [
        f"mean_days:{int(row.mean_days)}",
        f"mean_chaps:{int(row.mean_chaps)}"
    ])
    for _, row in user_stats.iterrows()
]

user_feature_strings = set()
for row in user_feats:
    user_feature_strings.update(row[1])

# Setup LightFM dataset
dataset = Dataset()
dataset.fit(
    users=df['user_id'].unique(),
    items=df['course_id'].unique(),
    user_features=user_feature_strings
)

user_features_matrix = dataset.build_user_features(user_feats)

# Build interactions with weights
max_days    = df['ndays_act'].max()
max_chaps   = df['nchapters'].max()

df['weight'] = (
    df['certified']
    * (1 + df['grade']/100)
    + 0.3*(df['ndays_act']/max_days)
    + 0.3*(df['nchapters']/max_chaps)
)

(interactions, weights) = dataset.build_interactions(
    df[['user_id','course_id','weight']].itertuples(index=False, name=None)
)


model = LightFM(
    no_components=80,
    learning_rate=0.01,
    item_alpha=0,
    loss='warp',
    random_state=42
)

# Train model using interactions

model.fit(interactions,
            epochs=30,
            verbose=True,
            user_features=user_features_matrix)


# Dump artifacts
out = os.path.join(settings.BASE_DIR, 'server', 'recommend', 'models')
os.makedirs(out, exist_ok=True)
joblib.dump(model, os.path.join(out, 'lightfm_model.joblib'))
with open(os.path.join(out, 'lightfm_dataset.pkl'),'wb') as f:
    pickle.dump(dataset.mapping(), f)

print("Retraining complete")  