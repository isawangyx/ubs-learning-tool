from django.shortcuts import render

# Create your views here.
from recommend.engine import content_based, lightfm_rec, hybrid
from modules.serializers import ModuleSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from modules.models import Module

class LearningPathView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,req):
        strategy=req.query_params.get("algo","hybrid")
        if strategy=="cb":   recs=content_based(req.user)
        elif strategy=="lfm":recs=lightfm_rec(req.user)
        else:                recs=hybrid(req.user)

        ordered={rid:i for i,rid in enumerate(recs["id"])}
        mods=list(Module.objects.filter(pk__in=ordered))
        mods.sort(key=lambda m:ordered[m.id])
        return Response(ModuleSerializer(mods,many=True).data)
