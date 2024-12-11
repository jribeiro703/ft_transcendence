# management/commands/testusers.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
import pyotp
import requests

class Command(BaseCommand):
    help = 'Create random test users with OTP secrets and avatars'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        num_users = 20
        created_users = []

        for i in range(num_users):
            username = f'user{i+1}'
            user_data = {
                'username': username,
                'email': f'{username}@example.com',
                'password': '88888888',
                'otp_secret': pyotp.random_base32()
            }
            
            if not User.objects.filter(username=user_data['username']).exists():
                user = User.objects.create_user(**user_data)
                
                # Add random avatar
                try:
                    # Get random image from Lorem Picsum
                    avatar_url = f'https://picsum.photos/200'
                    response = requests.get(avatar_url)
                    if response.status_code == 200:
                        filename = f'avatar_{username}.jpg'
                        user.avatar.save(filename, ContentFile(response.content), save=True)
                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(f"Failed to set avatar for {username}: {str(e)}")
                    )

                # Add all previous users as friends
                for existing_user in created_users:
                    user.friends.add(existing_user)
                    existing_user.friends.add(user)
                    existing_user.save()
                
                created_users.append(user)
                self.stdout.write(
                    self.style.SUCCESS(f"Created user {user.username} with OTP secret, avatar and added friends")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"User {user_data['username']} already exists")
                )