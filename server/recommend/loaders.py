import joblib, pickle, pandas as pd, threading
from pathlib import Path
_CACHE, _L = {}, threading.Lock()
BASE = Path("models")

def load_cb():
    with _L:
        if "cb" not in _CACHE:
            _CACHE["cb"] = joblib.load(BASE/"cb_pipeline.joblib")
        return _CACHE["cb"]

def load_lfm():
    with _L:
        if "lfm" not in _CACHE:
            _CACHE["lfm"]  = joblib.load(BASE/"lightfm_model.joblib")
            _CACHE["map"]  = pickle.load(open(BASE/"lightfm_dataset.pkl","rb"))
        return _CACHE["lfm"], _CACHE["map"]
