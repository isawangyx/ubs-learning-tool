from django.urls import path
from .views import ColdStartRecommend

urlpatterns = [
    path('cold_start/', ColdStartRecommend.as_view()),
]