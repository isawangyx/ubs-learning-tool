from .models import Module, Progress
from rest_framework import serializers

class ModuleSerializer(serializers.ModelSerializer):
    class Meta: model = Module; fields = "__all__"

class ProgressSerializer(serializers.ModelSerializer):
    class Meta: model = Progress; fields = "__all__"; read_only_fields = ("user",)
