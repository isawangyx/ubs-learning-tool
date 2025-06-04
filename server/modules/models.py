from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.conf import settings

class Module(models.Model):
    QUIZ = "quiz"; CODE = "code"; PROJ = "proj"
    TYPES = [(QUIZ,"Quiz"),(CODE,"Code Lab"),(PROJ,"Project")]
    title        = models.CharField(max_length=200)
    body_markdown= models.TextField()
    tags         = ArrayField(models.CharField(max_length=40), default=list)
    difficulty   = models.CharField(max_length=20) 
    module_type  = models.CharField(max_length=10, choices=TYPES)
    ext_url      = models.URLField(blank=True) # if scraped

class Progress(models.Model):
    STARTED="started"; DONE="completed"
    user    = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    module  = models.ForeignKey(Module,on_delete=models.CASCADE)
    status  = models.CharField(max_length=12,choices=[(STARTED,"started"),(DONE,"completed")])
    score   = models.FloatField(null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    class Meta: unique_together = ("user","module")
