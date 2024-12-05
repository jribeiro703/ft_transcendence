from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
	help = 'Create initial users'

	def handle(self, *args, **kwargs):
		User = get_user_model()
		users = [
			{'username': 'boty', 'email': 'boty@example.com', 'password': 'password123', 'avatar': '👾', 'friends': ['latha', 'ludo']},
			{'username': 'latha', 'email': 'latha@example.com', 'password': 'password123', 'avatar': '👩', 'friends': ['yabing', 'boty', 'gege']},
			{'username': 'ludo', 'email': 'ludo@example.com', 'password': 'password123', 'avatar': '🎮', 'friends': ['boty', 'yabing']},
			{'username': 'david', 'email': 'david@example.com', 'password': 'password123', 'avatar': '🎲', 'friends': ['jean']},
			{'username': 'yabing', 'email': 'yabing@example.com', 'password': 'password123', 'avatar': '🏹', 'friends': ['latha', 'ludo']},
			{'username': 'pierre', 'email': 'pierre@example.com', 'password': 'password123', 'avatar': '🏸', 'friends': ['jean']},
			{'username': 'jean', 'email': 'jean@example.com', 'password': 'password123', 'avatar': '🤖', 'friends': ['david', 'pierre']},
			{'username': 'gege', 'email': 'gege@example.com', 'password': 'password123', 'avatar': '🤖', 'friends': ['latha']},
		]
		for user_data in users:
			if not User.objects.filter(username=user_data['username']).exists():
				user = User.objects.create_user(username=user_data['username'], email=user_data['email'], password=user_data['password'])
				user.avatar = user_data['avatar']
				user.save()
				self.stdout.write(self.style.SUCCESS(f"User {user_data['username']} created with avatar {user_data['avatar']}"))
			else:
				user = User.objects.get(username=user_data['username'])
				user.avatar = user_data['avatar']
				user.save()
				self.stdout.write(self.style.WARNING(f"User {user_data['username']} already exists. Updated avatar to {user_data['avatar']}"))

		# Add friends
		for user_data in users:
			user = User.objects.get(username=user_data['username'])
			for friend_username in user_data['friends']:
				friend = User.objects.get(username=friend_username)
				user.friends.add(friend)
				friend.friends.add(user)
				self.stdout.write(self.style.SUCCESS(f"Friendship added between {user.username} and {friend.username}"))