from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
	help = 'Create initial users'

	def handle(self, *args, **kwargs):
		User = get_user_model()
		users = [
			{'username': 'boty', 'email': 'boty@example.com', 'password': 'password123'},
			{'username': 'latha', 'email': 'latha@example.com', 'password': 'password123'},
			{'username': 'ludo', 'email': 'ludo@example.com', 'password': 'password123'},
			{'username': 'david', 'email': 'david@example.com', 'password': 'password123'},
			{'username': 'yabing', 'email': 'yabing@example.com', 'password': 'password123'},
			{'username': 'pierre', 'email': 'pierre@example.com', 'password': 'password123'},
			{'username': 'jean', 'email': 'jean@example.com', 'password': 'password123'},
			{'username': 'gege', 'email': 'gege@example.com', 'password': 'password123'},
		]
		for user_data in users:
			if not User.objects.filter(username=user_data['username']).exists():
				User.objects.create_user(**user_data)
				self.stdout.write(self.style.SUCCESS(f"User {user_data['username']} created"))
			else:
				self.stdout.write(self.style.WARNING(f"User {user_data['username']} already exists"))