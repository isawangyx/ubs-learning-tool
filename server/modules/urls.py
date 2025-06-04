from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ModuleViewSet, ProgressViewSet

router = DefaultRouter()
router.register("", ModuleViewSet, basename="module")
router.register("progress", ProgressViewSet, basename="progress")

urlpatterns = [
    path('', include(router.urls)),
]
