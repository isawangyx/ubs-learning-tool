from django.contrib.postgres.fields import ArrayField
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='profile'
    )
    career_stage       = models.CharField(max_length=50)
    skills             = ArrayField(models.CharField(max_length=30), default=list)
    goals              = ArrayField(models.CharField(max_length=50), default=list)
    weekly_availability= models.JSONField(default=dict)
    preferred_content  = ArrayField(models.CharField(max_length=30), default=list)

    def __str__(self):
        return f"{self.user.username} Profile"
