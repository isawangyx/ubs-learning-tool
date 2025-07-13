from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import SavedModule, Module
from .serializers import SavedModuleSerializer

class SavedModuleViewSet(viewsets.ModelViewSet):
    """
    list:   GET  /api/saved-modules/         -> list current user's saved modules
    create: POST /api/saved-modules/         -> save a module (pass { module_id })
    destroy: DELETE /api/saved-modules/{pk}/ -> remove bookmark
    """
    serializer_class = SavedModuleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedModule.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        module_id = serializer.validated_data['module_id']
        module = get_object_or_404(Module, id=module_id)
        serializer.save(user=self.request.user, module=module)