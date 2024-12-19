# FILE: management/commands/connect.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from user.models import User

class Command(BaseCommand):
    help = 'Connect all users by setting their is_online status to False'

    def handle(self, *args, **kwargs):
        try:
            users = User.objects.filter(is_online=False)
            count = users.update(is_online=True)
            self.stdout.write(self.style.SUCCESS(f'Successfully connected {count} users.'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error connecting users: {str(e)}'))