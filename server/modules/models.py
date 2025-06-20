from django.db import models

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
    
