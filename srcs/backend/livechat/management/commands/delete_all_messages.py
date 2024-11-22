from django.core.management.base import BaseCommand
from livechat.models import Message

class Command(BaseCommand):
    help = 'Delete all messages from the database'

    def handle(self, *args, **kwargs):
        Message.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully deleted all messages'))