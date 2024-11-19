# tournament/consumers.py
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
import json
import logging

logger = logging.getLogger(__name__)

class TournamentConsumer(WebsocketConsumer):
	def connect(self):
		# Step 1: Accept the WebSocket connection
		self.accept()
		
		#all_users = self.get_all_users()
		# logger.info("Fetched all users: %s", all_users)

		#if not all_users:
			# logger.warning("No users found in the database. Using hardcoded list.")
		all_users = ["boty", "fumo", "yachen", "white-fox", "lannur-s", "jarkan"]  # Hardcoded fallback

		# Step 2: Send a welcome message to the client
		self.send(text_data=json.dumps({
			'message': 'Welcome to the WebSocket connection!',
			'participants': all_users
		}))

	def disconnect(self, close_code):
		# Step 3: Handle the WebSocket disconnection
		print("WebSocket disconnected")
	
	def get_all_users(self):
		try:
			# Fetch all usernames from the User table
			users = User.objects.values_list('username', flat=True)
			user_list = list(users)  # Convert to a list for easier size checking
			print(f"Fetched {len(user_list)} users: {user_list}")
			return user_list
		except Exception as e:
			logger.error(f"Error fetching users: {e}")
			print("No users found in the database.")
			return []