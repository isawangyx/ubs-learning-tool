from datetime import datetime
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import ModuleProgress
from .serializers import ProgressUpdateSerializer
from django.db.models.functions import TruncDate
from django.db.models import Max, Sum

class ProgressUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET /api/module-progress/?certified=true|false
        Returns the current user's ModuleProgress records,
        optionally filtered by certified status.
        """
        qs = ModuleProgress.objects.filter(user=request.user)
        cert = request.query_params.get('certified')
        if cert is not None:
            is_cert = cert.lower() in ['true', '1']
            qs = qs.filter(certified=is_cert)

        results = []
        for prog in qs:
            results.append({
                'id': prog.id,
                'module': {
                    'id': prog.module.id,
                    'title': prog.module.title,
                },
                'grade': prog.grade,
                'last_event': prog.last_event,
                'ndays_act': prog.ndays_act,
                'nchapters': prog.nchapters,
                'certified': prog.certified,
            })
        return Response(results)

    def post(self, request):
        serializer = ProgressUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user      = request.user
        m_id      = serializer.validated_data['module_id']
        event     = serializer.validated_data['event_type']
        grade     = serializer.validated_data.get('grade')
        certified = serializer.validated_data.get('certified')

        prog, created = ModuleProgress.objects.get_or_create(
            user=user, module_id=m_id,
            defaults={'start_time': datetime.now(), 'last_event': datetime.now(), 'ndays_act': 1}
        )

        now = datetime.now()

        if created:
            pass
        else:
            if prog.last_event.date() != now.date():
                prog.ndays_act += 1
            prog.last_event = now
            
        if event == 'chapter':
            prog.nchapters += 1
        elif event == 'complete':
            prog.grade = grade
            prog.certified = certified

        prog.save()
        
        return Response({
            'start_time': prog.start_time,
            'last_event': prog.last_event,
            'ndays_act': prog.ndays_act,
            'nchapters': prog.nchapters,
            'grade': prog.grade,
            'certified': prog.certified,
        }, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def progress_history(request):
    user = request.user
    qs = (
        ModuleProgress.objects
        .filter(user=user)
        .annotate(date=TruncDate('last_event'))
        .values('date')
        .annotate(
            total_days=Max('ndays_act'),
            total_chaps=Sum('nchapters')
        )
        .order_by('date')
    )
    data = [
        {'date': entry['date'], 'ndays_act': entry['total_days'], 'nchapters': entry['total_chaps']}
        for entry in qs
    ]
    return Response(data)