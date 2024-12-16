import os
import pyotp
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Create a superuser with environment variables'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        username = os.environ.get('POSTGRES_USER')
        password = os.environ.get('POSTGRES_PASSWORD')
        email = os.environ.get('SUPERUSER_EMAIL', 'transcendence@transcendence.transcendence')
        otp_secret = pyotp.random_base32()  # Generate base32 OTP secret

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username=username, password=password, email=email, otp_secret=otp_secret)
            self.stdout.write(self.style.SUCCESS(f'Successfully created superuser {username} with OTP secret'))
        else:
            self.stdout.write(self.style.WARNING(f'Superuser {username} already exists'))