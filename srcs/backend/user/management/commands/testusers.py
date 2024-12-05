# management/commands/testusers.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import pyotp
import random
import string

class Command(BaseCommand):
    help = 'Create random test users with OTP secrets'

    def generate_username(self, length=8):
        letters = string.ascii_lowercase
        digits = string.digits
        return ''.join(random.choice(letters) + ''.join(random.choices(letters + digits, k=length-1)))

    def handle(self, *args, **kwargs):
        User = get_user_model()
        num_users = 10
        created_users = []

        for i in range(num_users):
            username = self.generate_username()
            user_data = {
                'username': username,
                'email': f'{username}@example.com',
                'password': '88888888',
                'otp_secret': pyotp.random_base32()  # Generate base32 OTP secret
            }
            
            if not User.objects.filter(username=user_data['username']).exists():
                user = User.objects.create_user(**user_data)
                # Add all previous users as friends
                for existing_user in created_users:
                    user.friends.add(existing_user)
                    existing_user.friends.add(user)
                    existing_user.save()
                created_users.append(user)
                self.stdout.write(
                    self.style.SUCCESS(f"Created user {user.username} with OTP secret and added friends")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"User {user_data['username']} already exists")
                )