from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SavedModuleViewSet

router = DefaultRouter()
router.register('', SavedModuleViewSet, basename='saved-modules')

urlpatterns = [
    path('', include(router.urls)),
]
