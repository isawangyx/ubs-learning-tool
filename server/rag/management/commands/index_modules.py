from django.core.management.base import BaseCommand
from rag.services.chroma_store import index_all_modules

class Command(BaseCommand):
    help = "Embed & upsert all modules into Deepseek"

    def handle(self, *args, **kwargs):
        index_all_modules()
        self.stdout.write(self.style.SUCCESS("Indexed all modules!"))
