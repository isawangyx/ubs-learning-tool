import os, joblib, pickle, numpy as np
from django.conf import settings

MODEL_DIR    = os.path.join(settings.BASE_DIR, 'recommend', 'models')
MAPPING_PATH = os.path.join(MODEL_DIR, 'lightfm_dataset.pkl')
MODEL_PATH   = os.path.join(MODEL_DIR, 'lightfm_model.joblib')

with open(MAPPING_PATH, 'rb') as f:
    user_map, _, item_map, _ = pickle.load(f)

_model = None

reverse_item = {v:k for k,v in item_map.items()}
WARM_USERS = set(user_map.keys())

def get_cf_recs(user_id, N=10, user_features=None):
    global _model

    if user_id not in user_map:
        return []
    idx = user_map[user_id]

    if _model is None:
        if not os.path.exists(MODEL_PATH):
            return []
        import joblib
        _model = joblib.load(MODEL_PATH)

    n_items = _model.item_embeddings.shape[0]
    user_ids = np.repeat(idx, n_items)
    item_ids = np.arange(n_items)
    scores   = _model.predict(user_ids, item_ids, user_features=user_features)
    top_idx  = np.argsort(-scores)[:N]

    return [ reverse_item[i] for i in top_idx ]
