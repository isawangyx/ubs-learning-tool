from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ModuleListView, ModuleDetailView

urlpatterns = [
    path('', ModuleListView.as_view(), name='module-list'),
    path('<int:pk>/', ModuleDetailView.as_view(), name='module-detail'),
]
