from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = "Create dummy users"

    def handle(self, *args, **options):
        User = get_user_model()
        created = 0

        for i in range(1, 11):
            username = f"seed_user{i}"
            email    = f"{username}@example.com"
            user, was_created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": email,
                    "is_active": True,
                }
            )
            if was_created:
                user.set_unusable_password()
                user.save(update_fields=['password'])
                created += 1

        self.stdout.write(self.style.SUCCESS(
            f"✅ Seeded {created} users (or verified exist)."
        ))
