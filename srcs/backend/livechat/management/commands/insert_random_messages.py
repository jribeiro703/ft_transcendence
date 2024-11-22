import random
import string
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from livechat.models import Message

class Command(BaseCommand):
    help = 'Insert specific messages into the database'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        timestamps = [
            now,  # Now
            now - timedelta(hours=1),  # One hour ago
            now - timedelta(hours=6),  # Six hours ago
            now - timedelta(days=1),  # One day ago
            now - timedelta(weeks=1),  # One week ago
            now - timedelta(days=30)  # One month ago
        ]

        for timestamp in timestamps:
            nickname = ''.join(random.choices(string.ascii_letters + string.digits, k=5))
            content = ' '.join(random.choices(string.ascii_letters + string.digits, k=20))
            Message.objects.create(nickname=nickname, content=content, timestamp=timestamp)
        
        self.stdout.write(self.style.SUCCESS('Successfully inserted specific messages'))