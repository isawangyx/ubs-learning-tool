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
        # 1) CB recs
        cb_out = ColdStartRecommend().post(request).data

        # 2) CF recs
        cf_ids = get_cf_recs(user.id, N=10)
        cf_qs  = Module.objects.filter(external_id__in=cf_ids)
        cf_out = ModuleSerializer(cf_qs, many=True).data

        # 3) Blend
        if user.id in WARM_USERS:
            cf_ids_set = {m['id'] for m in cf_out}
            hybrid = cf_out[:5] + [m for m in cb_out if m['id'] not in cf_ids_set][:5]
        else:
            hybrid = cb_out

        return Response(hybrid, status=status.HTTP_200_OK)
