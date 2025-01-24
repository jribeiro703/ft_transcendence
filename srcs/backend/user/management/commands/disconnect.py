# FILE: management/commands/disconnect.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from user.models import User

class Command(BaseCommand):
    help = 'Disconnect all users by setting their is_online status to False'

    def handle(self, *args, **kwargs):
        try:
            users = User.objects.filter(is_online=True)
            count = users.update(is_online=False)
            self.stdout.write(self.style.SUCCESS(f'Successfully disconnected {count} users.'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error disconnecting users: {str(e)}'))