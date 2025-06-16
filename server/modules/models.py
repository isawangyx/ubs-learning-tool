from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.conf import settings

class Module(models.Model):
    QUIZ = "quiz"; CODE = "code"; PROJ = "proj"
    TYPES = [(QUIZ,"Quiz"),(CODE,"Code Lab"),(PROJ,"Project")]

    title        = models.CharField(max_length=200)
    duration     = models.FloatField(help_text="Duration in hours", default=0)
    skill_tags    = models.JSONField(default=list)
    goal_tags     = models.JSONField(default=list)
    level        = models.CharField(max_length=20, default="Beginner level") 
    module_type  = models.CharField(max_length=10, choices=TYPES)

    avg_rating   = models.FloatField(default=0)
    popularity   = models.FloatField(default=0)
    review_count = models.IntegerField(default=0)

    def __str__(self):
        return self.title
    
class Progress(models.Model):
    STARTED="started"; DONE="completed"
    user    = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    module  = models.ForeignKey(Module,on_delete=models.CASCADE)
    status  = models.CharField(max_length=12,choices=[(STARTED,"started"),(DONE,"completed")])
    score   = models.FloatField(null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    class Meta: unique_together = ("user","module")
