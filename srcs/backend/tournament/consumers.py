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
		self.send(text_data=json.dumps({
			'message': 'WebSocket connection established!',
		}))

	def disconnect(self, close_code):
		# Step 3: Handle the WebSocket disconnection
		logger.info("WebSocket disconnected")

	def receive(self, text_data):
		# Step 4: Handle incoming WebSocket messages
		try:
			data = json.loads(text_data)
			action = data.get('action')

			if action == "get_all_users":
				self.get_all_users()
			else:
				self.send(text_data=json.dumps({
					'error': 'Invalid action received.'
				}))
		except Exception as e:
			logger.error(f"Error processing WebSocket message: {e}")
			self.send(text_data=json.dumps({
				'error': 'An error occurred while processing the request.'
			}))

	def get_all_users(self):
		try:
			# Fetch all usernames from the User table
			User = get_user_model()
			users = list(User.objects.values_list('username', flat=True))

			# Send the user list back to the client
			self.send(text_data=json.dumps({
				'action': 'get_all_users',
				'users': users
			}))
		except Exception as e:
			logger.error(f"Error fetching users: {e}")
			self.send(text_data=json.dumps({
				'error': 'Failed to fetch user list.'
			}))
