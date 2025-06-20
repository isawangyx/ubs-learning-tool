from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from modules.models import Module
from moduleprogress.models import ModuleProgress
from datetime import datetime, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = "Seed ModuleProgress with dummy data for existing users"

    def handle(self, *args, **options):
        users   = User.objects.filter(username__startswith='seed_user')
        modules = list(Module.objects.all())
        total = 0

        for user in users:
            # give each user 3–5 random modules
            for module in random.sample(modules, k=min(5, len(modules))):
                mp, created = ModuleProgress.objects.get_or_create(
                    user=user, module=module,
                    defaults={
                        'ndays_act':  random.randint(1,3),
                        'nchapters': random.randint(1,4),
                        'certified': random.choice([True, False]),
                        'grade':     random.randint(50,100),
                        'start_time': datetime.now() - timedelta(days=random.randint(1,7)),
                        'last_event': datetime.now() - timedelta(days=random.randint(0,1)),
                    }
                )
                if created:
                    total += 1

        self.stdout.write(self.style.SUCCESS(
            f"✅ Seeded {total} ModuleProgress rows."
        ))
