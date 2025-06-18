import os, joblib, pickle, numpy as np
from django.conf import settings
from lightfm import LightFM
from lightfm.data import Dataset

MODEL_PATH   = os.path.join(settings.BASE_DIR, 'server', 'recommend', 'models', 'lightfm_model.joblib')
MAPPING_PATH = os.path.join(settings.BASE_DIR, 'server', 'recommend', 'models', 'lightfm_dataset.pkl')
model: LightFM = joblib.load(MODEL_PATH)
user_map, _, item_map, _ = pickle.load(open(MAPPING_PATH,'rb'))
reverse_item = {v:k for k,v in item_map.items()}

WARM_USERS = set(user_map.keys())

def get_cf_recs(user_id, N=10, user_features=None):
    if user_id not in user_map:
        return []
    uidx = user_map[user_id]
    n_items = model.item_embeddings.shape[0]
    scores = model.predict(
        np.repeat(uidx, n_items),
        np.arange(n_items),
        user_features=user_features
    )
    tops = np.argsort(-scores)[:N]
    return [ reverse_item[i] for i in tops ]
