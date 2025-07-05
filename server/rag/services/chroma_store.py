import chromadb
from langchain_huggingface import HuggingFaceEmbeddings
from modules.models import Module

# 1) init Chroma client & collection
chroma_client = chromadb.PersistentClient(path=".chromadb")

collection = chroma_client.get_or_create_collection("modules")

# 2) init BGE via HuggingFace
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-base-en-v1.5")

def index_all_modules():
    ids, embs, metas, docs  = [], [], [], []
    for m in Module.objects.all():
        ids.append(str(m.id))
        # combine title and description into a single text
        text = "\n".join([m.title, *m.goal_tags])
        docs.append(text)
        embs.append(embeddings.embed_documents([text])[0])
        metas.append({
          "title":    m.title,
          "rating":   m.avg_rating,
          "duration": m.duration,
          "skills":   m.skill_tags,
        })
    collection.upsert(
      ids=ids, embeddings=embs, metadatas=metas, documents=docs
    )
