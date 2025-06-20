from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Module
from .serializers import ModuleSerializer

class ModuleViewSet(ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer