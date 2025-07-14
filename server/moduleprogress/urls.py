from django.urls import path
from .views import ProgressUpdateView, progress_history, module_progress_stats

urlpatterns = [
    path('', ProgressUpdateView.as_view(), name='progress-update-default'),
    path('update/', ProgressUpdateView.as_view(), name='progress-update'),
    path('history/', progress_history, name='progress-history'),
    path('stats/', module_progress_stats, name='progress-stats'),
]
