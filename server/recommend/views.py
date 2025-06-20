from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .content_filter import ColdStartRecommend  
from .services import get_cf_recs, WARM_USERS
from modules.models import Module
from modules.serializers import ModuleSerializer

class HybridRecommend(APIView):
    def post(self, request):
        user = request.user

        # 1) Run content-based filtering
        cb_out = ColdStartRecommend().post(request).data

        # 2) If warm, run  collaborative filtering
        if user.id in WARM_USERS:
            cf_ids = get_cf_recs(user.id, N=10)
            qs     = Module.objects.filter(id__in=cf_ids)
            cf_out = ModuleSerializer(qs, many=True).data

            # 3) Blend: top-5 CF + top-5 CB deduped
            cf_set = {m['id'] for m in cf_out}
            hybrid = cf_out[:5] + [m for m in cb_out if m['id'] not in cf_set][:5]
        else:
            hybrid = cb_out

        return Response(hybrid)
