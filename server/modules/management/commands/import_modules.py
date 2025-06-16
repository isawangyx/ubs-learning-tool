from django.core.management.base import BaseCommand
from modules.models import Module
import csv, json

class Command(BaseCommand):
    help = 'Import modules from CSV'

    def add_arguments(self, parser):
        parser.add_argument('csv_path', type=str)

    def handle(self, *args, **opts):
        path = opts['csv_path']
        with open(path) as f:
            reader = csv.DictReader(f)
            for row in reader:
                if any(not value.strip() for value in row.values()):
                    continue
                Module.objects.update_or_create(
                    title=row['Course Name'],
                    defaults={
                        'duration': float(row['Duration']),
                        'skill_tags': json.dumps(row['Course Skills'].split(',')),
                        'goal_tags':  json.dumps(row['Description'].split(',')),
                        'level': row.get('Level','Beginner level'),
                        'avg_rating': float(row.get('Ratings',0)),
                        'popularity': float(row.get('Popularity',0)),
                        'review_count': int(row.get('Review Count',0)),
                    }
                )
        self.stdout.write(self.style.SUCCESS('Imported modules.'))
