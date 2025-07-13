from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Module
from .serializers import ModuleSerializer
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters

class TwelvePerPagePagination(PageNumberPagination):
    page_size = 12
    max_page_size = 12

class ModuleListView(ListAPIView):
    queryset = Module.objects.all().order_by('id')
    serializer_class = ModuleSerializer
    pagination_class = TwelvePerPagePagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'skill_tags']

class ModuleDetailView(RetrieveAPIView):
    """
    GET /api/modules/<pk>/  → returns one Module serialized.
    """
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer