from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Module, Progress
from .serializers import ModuleSerializer, ProgressSerializer

class ModuleViewSet(ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

class ProgressViewSet(ModelViewSet):
    serializer_class = ProgressSerializer
    def get_queryset(self):
        return Progress.objects.filter(user=self.request.user)
    def perform_create(self,ser): ser.save(user=self.request.user)
