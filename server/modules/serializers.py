from .models import Module
from rest_framework import serializers

class ModuleSerializer(serializers.ModelSerializer):
    class Meta: model = Module; fields = "__all__"