from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from userprofile.models import UserProfile
import random

User = get_user_model()

CAREER_STAGES = ['Junior', 'Mid', 'Senior', 'Lead']
SKILL_POOL    = ['python','django','rest','react','docker','sql','git', 'frontend','backend','devops', 'data science', 'ml', 'ai', 'ux']
GOAL_POOL     = ['build api','learn ml','deploy app','improve design','optimize performance']
CONTENT_POOL  = ['video','article','interactive','quiz']

class Command(BaseCommand):
    help = "Create UserProfile for each existing user if missing"

    def handle(self, *args, **options):
        User = get_user_model()
        created = 0
        updated = 0

        for user in User.objects.all():
            profile, was_created = UserProfile.objects.get_or_create(user=user)
            changed = False

            # give each user a random career stage
            if was_created or not profile.career_stage:
                profile.career_stage = random.choice(CAREER_STAGES)
                changed = True

            # give each user 2–4 random skills
            if was_created or not profile.skills:
                profile.skills = random.sample(SKILL_POOL, k=random.randint(2,4))
                changed = True

            # give each user 1–3 random goals
            if was_created or not profile.goals:
                profile.goals = random.sample(GOAL_POOL, k=random.randint(1,3))
                changed = True

            # simulate weekly availability (0–4 hrs per weekday)
            if was_created or not profile.weekly_availability:
                profile.weekly_availability = {
                    day: random.randint(0,4)
                    for day in ['mon','tue','wed','thu','fri','sat','sun']
                }
                changed = True

            # pick 1–3 preferred content types
            if was_created or not profile.preferred_content:
                profile.preferred_content = random.sample(CONTENT_POOL, k=random.randint(1,3))
                changed = True

            if changed:
                profile.save()
                if was_created:
                    created += 1
                else:
                    updated += 1

        self.stdout.write(self.style.SUCCESS(
            f"✅ Created {created} profiles and updated {updated} existing ones."
        ))