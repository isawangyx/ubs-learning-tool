from django.urls import path
from .views import ProgressUpdateView, progress_history

urlpatterns = [
    path('', ProgressUpdateView.as_view(), name='progress-update-default'),
    path('update/', ProgressUpdateView.as_view(), name='progress-update'),
    path('history/', progress_history, name='progress-history'),
]
