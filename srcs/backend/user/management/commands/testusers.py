# management/commands/testusers.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
import pyotp
import requests
from secrets import token_urlsafe
from game.models import Game
import random
from django.utils import timezone


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
				'otp_secret': pyotp.random_base32(),
				'game_token': token_urlsafe(4)[:5]  # Generate a 5-character game token
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

			# Add 10 random matchs for alls users
			for user in created_users:
				num_matches_per_user = 10
				other_users = [u for u in created_users if u != user]

				if not other_users:
					self.stdout.write(self.style.WARNING(f"Not enough users to create matches for {user.username}. Skipping matches."))
					continue	

				for _ in range(num_matches_per_user):
					if not other_users:
						self.stdout.write(self.style.WARNING(f"Not enough users to create matches for {user.username}."))
						break

				opponent = random.choice(other_users)
				score_one = random.randint(0, 10)
				score_two = random.randint(0, 10)
				winner = user if score_one > score_two else opponent if score_two > score_one else None

				game = Game.objects.create(
					player_one=user,
					player_two=opponent,
					status='NOT_STARTED',
					difficulty=random.choice(['EASY', 'MEDIUM', 'HARD']),
					level=random.choice(['TABLETENNIS', 'FOOTBALL', 'TENNIS', 'CLASSIC']),
					max_score=random.randint(5, 15),
					created_at=timezone.now(),
					start_time=None,
					end_time=None,
					powerup=random.choice([True, False]),
					time_played=random.randint(0, 300),
					score_one=score_one,
					score_two=score_two,
					winner=winner
				)

				self.stdout.write(self.style.SUCCESS(f"Match created: {game} between {user.username} and {opponent.username} "))
