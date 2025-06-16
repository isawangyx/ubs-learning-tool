import numpy as np, pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from .loaders import load_cb, load_lfm
from modules.models import Module  

def content_based(user):
    cb = load_cb()
    vect_sk, vect_inst, vect_desc, scaler, weights = cb.values()

    # build user vector
    u_sk  = vect_sk.transform([" ".join(user.profile.skills)])
    u_ins = vect_inst.transform([user.profile.career_stage])
    u_des = vect_desc.transform([" ".join(user.profile.goals)])

    df = pd.DataFrame(list(Module.objects.all().values("id","tags","difficulty","module_type","title")))
    df["tags_join"] = df["tags"].apply(lambda lst:" ".join(lst))

    sk = vect_sk.transform(df["tags_join"])
    ins= vect_inst.transform(df["difficulty"])
    des= vect_desc.transform(df["module_type"])

    sim = (
        weights["Skills"]      * cosine_similarity(u_sk , sk ).flatten()+
        weights["Institution"] * cosine_similarity(u_ins, ins).flatten()+
        weights["Description"] * cosine_similarity(u_des, des).flatten()
    )
    df["score"] = sim
    return df.sort_values("score",ascending=False).head(10)

def lightfm_rec(user):
    model,(u_map,_,i_map,_) = load_lfm()
    if user.id not in u_map: return pd.DataFrame()   # cold start
    uid   = u_map[user.id]
    n_it  = len(i_map)
    scores= model.predict(uid, np.arange(n_it))
    top   = np.argsort(-scores)[:10]
    rev   = {v:k for k,v in i_map.items()}
    mod_ids = [rev[i] for i in top]
    qs  = Module.objects.filter(pk__in=mod_ids)
    df  = pd.DataFrame(qs.values("id","title"))
    df["score"]=scores[top]
    return df

def hybrid(user):
    cb = content_based(user)
    lf = lightfm_rec(user)
    comb = (pd.concat([cb, lf]).drop_duplicates("id")
              .sort_values("score",ascending=False).head(10))
    return comb
