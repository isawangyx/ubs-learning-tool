from django.urls import path
from .views import HybridRecommend

urlpatterns = [
    path('hybrid/', HybridRecommend.as_view()),
]