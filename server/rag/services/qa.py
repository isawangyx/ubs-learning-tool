from langchain.chains import RetrievalQA
from langchain_chroma import Chroma
from langchain_deepseek import ChatDeepSeek
import os

from .chroma_store import embeddings

# 1) wrap Chroma in a LangChain VectorStore
store = Chroma(
    collection_name="modules",
    embedding_function=embeddings,
    persist_directory=".chromadb",
)

# 2) init LLM
llm = ChatDeepSeek(
  model="deepseek-chat",
  api_key=os.getenv("DEEPSEEK_API_KEY"),
  temperature=0.2,
)

# 3) build the chain
qa_chain = RetrievalQA.from_chain_type(
  llm=llm,
  chain_type="stuff",
  retriever=store.as_retriever(search_kwargs={"k":5}),
  return_source_documents=True
)

def ask_with_langchain(question: str):
    res = qa_chain({"query": question})
    return {
      "answer":  res["result"],
      "sources": [
        doc.metadata
        for doc in res["source_documents"]
      ]
    }
