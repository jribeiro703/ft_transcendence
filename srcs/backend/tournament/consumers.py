# tournament/consumers.py
from channels.generic.websocket import WebsocketConsumer
import json

class TournamentConsumer(WebsocketConsumer):
	def connect(self):
		# Step 1: Accept the WebSocket connection
		self.accept()
		
		all_users = self.get_all_users()

		# Step 2: Send a welcome message to the client
		self.send(text_data=json.dumps({
			'message': 'Welcome to the WebSocket connection!',
			'participants': ['test1', 'test2']
		}))

	def disconnect(self, close_code):
		# Step 3: Handle the WebSocket disconnection
		print("WebSocket disconnected")