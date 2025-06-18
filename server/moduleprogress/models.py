from django.db import models
from django.conf import settings
from modules.models import Module

class ModuleProgress(models.Model):
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    module     = models.ForeignKey(Module, on_delete=models.CASCADE)
    ndays_act  = models.IntegerField(default=0)
    nchapters  = models.IntegerField(default=0)
    certified  = models.BooleanField(default=False)
    grade      = models.IntegerField(default=0)
    start_time = models.DateTimeField(null=True, blank=True)
    last_event = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'module')