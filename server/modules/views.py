from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Module
from .serializers import ModuleSerializer
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination

class TwelvePerPagePagination(PageNumberPagination):
    page_size = 12
    max_page_size = 12

class ModuleListView(ListAPIView):
    queryset = Module.objects.all().order_by('id')
    serializer_class = ModuleSerializer
    pagination_class = TwelvePerPagePagination
class ModuleDetailView(RetrieveAPIView):
    """
    GET /api/modules/<pk>/  → returns one Module serialized.
    """
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer