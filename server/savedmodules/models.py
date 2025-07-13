from django.db import models
from django.conf import settings
from modules.models import Module 

class SavedModule(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE
    )
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'module')
        ordering = ['-saved_at']