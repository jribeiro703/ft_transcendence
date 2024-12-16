# tournament/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from random import choice, randint
from django.apps import apps
import json
import logging

logger = logging.getLogger(__name__)

class TournamentConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		# Step 1: Accept the WebSocket connection
		await self.accept()
		await self.send(text_data=json.dumps({
			'message': 'WebSocket connection established!',
		}))

	async def disconnect(self, close_code):
		# Step 3: Handle the WebSocket disconnection
		logger.info("WebSocket disconnected")

	async def receive(self, text_data):
		# Step 4: Handle incoming WebSocket messages
		try:
			data = json.loads(text_data)
			action = data.get('action')

			if action == "get_all_users":
				await self.get_all_users()
			elif action == "create_demo_game":
				await self.create_demo_game()
			else:
				await self.send(text_data=json.dumps({
					'error': 'Invalid action received.'
				}))
		except json.JSONDecodeError as e:
			logger.error(f"JSON decode error: {e}")
			await self.send(text_data=json.dumps({
				'error': 'Invalid JSON received.'
			}))
		except Exception as e:
			logger.error(f"Unexpected error: {e}")
			await self.send(text_data=json.dumps({
				'error': 'An unexpected error occurred.'
			}))

	async def get_all_users(self):
		try:
			# Dynamically get the User model inside the method
			User = get_user_model()
			users = await sync_to_async(list)(User.objects.values_list('username', flat=True))

			# Validate the result
			if not users:
				await self.send(text_data=json.dumps({
					'action': 'get_all_users',
					'users': [],
					'message': 'No users found.'
				}))
			else:
				await self.send(text_data=json.dumps({
					'action': 'get_all_users',
					'users': users
				}))
		except Exception as e:
			logger.error(f"Error fetching users: {e}")
			await self.send(text_data=json.dumps({
				'error': f'Failed to fetch user list: {str(e)}'
			}))

	async def create_demo_game(self):
		from django.apps import apps  # Import here to avoid module-level issues
		try:
			# Dynamically get the Game model
			Game = apps.get_model('game', 'Game')
			User = get_user_model()

			# Fetch all usernames from the User table
			users = await sync_to_async(list)(User.objects.all())

			if len(users) < 2:
				await self.send(text_data=json.dumps({
					'action': 'create_demo_game',
					'message': 'Not enough users to create a demo game.'
				}))
				return

			random_players = [choice(users), choice(users)]
			demo_game = await sync_to_async(Game.objects.create)(
				player_one=random_players[0],
				player_two=random_players[1],
				score_one=randint(0, 10),
				score_two=randint(0, 10),
				created_at="2024-11-21T12:00:00Z"
			)

			await self.send(text_data=json.dumps({
				'action': 'create_demo_game',
				'game': {
					'player_one': demo_game.player_one.id if demo_game.player_one else None,
					'player_two': demo_game.player_two.id if demo_game.player_two else None,
					'score_one': demo_game.score_one,
					'score_two': demo_game.score_two,
				}
			}))
		except Exception as e:
			logger.error(f"Error creating demo game: {e}")
			await self.send(text_data=json.dumps({
				'error': f'Failed to create demo game: {str(e)}'
			}))

# ------------------------------ USER related websockets ------------------------#

class FriendConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		logger.info("WebSocket connection established")
		self.user = self.scope["user"]
		await self.accept()

	async def disconnect(self, close_code):
		logger.info(f"WebSocket connection closed with code: {close_code}")

	async def receive(self, text_data):
		logger.info("Received message from client")
		data = json.loads(text_data)
		logger.info(f"Received data: {data}")
		if data['action'] == 'get_friends':
			await self.send_friends_list()

	async def send_friends_list(self):
		User = apps.get_model('user', 'User')
		default_user = await sync_to_async(User.objects.first)()
		logger.info(f"Default user: {default_user}")
		friends = await sync_to_async(list)(default_user.friends.all())
		logger.info(f"Email: {default_user.email}")
		logger.info(f"Friends list: {friends}")
		friend_list = [{'id': friend.id, 'username': friend.username, 'avatar': friend.avatar.url} for friend in friends]
		logger.info(f"Friend list to send: {friend_list}")
		await self.send(text_data=json.dumps({'action': 'get_friends', 'friends': friend_list}))


class UserStatusConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		await self.accept()

	async def disconnect(self, close_code):
		pass

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		message = text_data_json['message']

		await self.send(text_data=json.dumps({
			'message': message
		}))
