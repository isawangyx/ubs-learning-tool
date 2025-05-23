from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'career_stage',
            'skills',
            'goals',
            'weekly_availability',
            'preferred_content',
        ]
