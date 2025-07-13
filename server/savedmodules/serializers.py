from rest_framework import serializers
from .models import SavedModule
from modules.serializers import ModuleSerializer

class SavedModuleSerializer(serializers.ModelSerializer):
    module = ModuleSerializer(read_only=True)
    module_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = SavedModule
        fields = ['id', 'module', 'module_id', 'saved_at']