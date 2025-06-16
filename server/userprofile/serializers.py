from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):

    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UserProfile
        fields = [
            'username',
            'career_stage',
            'skills',
            'goals',
            'weekly_availability',
            'preferred_content',
        ]
