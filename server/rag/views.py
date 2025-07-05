from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services.qa import ask_with_langchain

@api_view(["POST"])
def rag_chat(request):
    q = request.data.get("question","")
    if not q:
        return Response({"error":"No question"},400)
    return Response(ask_with_langchain(q))
