from django.urls import path
from .views import ColdStartRecommend
from .views import HybridRecommend

urlpatterns = [
    path('cold_start/', ColdStartRecommend.as_view()),
    path('hybrid/', HybridRecommend.as_view()),
]