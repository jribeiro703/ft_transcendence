import json
import logging
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PongConsumer(WebsocketConsumer):
	rooms = {}

	def connect(self):
		self.room_name = self.scope['url_route']['kwargs'].get('room_name')
		if self.room_name:
			self.room_group_name = f'game_{self.room_name}'
			# Join room group
			async_to_sync(self.channel_layer.group_add)(
				self.room_group_name,
				self.channel_name
			)
			self.accept()
			logger.info(f'Client {self.channel_name} connected to room {self.room_name}')
		else:
			self.accept()
			logger.info(f'Client {self.channel_name} connected without a room')
		self.log_all_rooms()

	def disconnect(self, close_code):
		if self.room_name:
			# Leave room group
			async_to_sync(self.channel_layer.group_discard)(
				self.room_group_name,
				self.channel_name
			)
			# Remove client from room
			if self.room_name in self.rooms:
				self.rooms[self.room_name].remove(self.channel_name)
				if not self.rooms[self.room_name]:
					del self.rooms[self.room_name]
				# Send message to room group
				async_to_sync(self.channel_layer.group_send)(
					self.room_group_name,
					{
						'type': 'client_left',
						'message': f'Client {self.channel_name} has left the room.'
					}
				)
				# Delete room if empty
				if not self.rooms[self.room_name]:
					del self.rooms[self.room_name]
		self.log_all_rooms()

	def receive(self, text_data):
		data = json.loads(text_data)
		if data['type'] == 'join_room':
			self.join_room()
		elif data['type'] == 'ball_data':
			self.broadcast_ball_data(data)
		elif data['type'] == 'direction_data':
			self.broadcast_direction_data(data)
		elif data['type'] == 'paddle_data':
			self.broadcast_paddle_data(data)
		elif data['type'] == 'player_data':
			self.broadcast_player_data(data)
		elif data['type'] == 'game_data':
			self.broadcast_game_data(data)
		elif data['type'] == 'check_rooms':
			self.check_rooms()

	def join_room(self):
		if self.room_name not in self.rooms:
			self.rooms[self.room_name] = []
		self.rooms[self.room_name].append(self.channel_name)
		# Send message to room group
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'client_joined',
				'message': f'Client {self.channel_name} has joined the room.'
			}
		)
		# Send mesage to room group
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'room_joined',
				'room_name': self.room_name
			}
		)
		self.log_all_rooms()

	def log_all_rooms(self):
		for room, clients in self.rooms.items():
			logger.info(f'Room {room} has clients : {clients}')

	def broadcast_ball_data(self, data):
		# Send ball data to room group
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'ball_data',
				'x': data['x'],
				'y': data['y'],
			}
		)

	def broadcast_direction_data(self, data):
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'direction_data',
				'dx': data['dx'],
				'dy': data['dy'],
			}
		)

	def broadcast_paddle_data(self, data):
		# Send paddle data to room group
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'paddle_data',
				'paddle_y': data['paddle_y'],
				'playerIdx': data['playerIdx'],
			}
		)

	def broadcast_player_data(self, data):
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'player_data',
				'playerReady': data['playerReady'],
				'currentServer': data['currentServer'],
			}
		)

	def broadcast_game_data(self, data):
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'player_data',
				'gameStart': data['gameStart'],
				'gameReady': data['gameReady'],
				'animationFrame': data['animationFrame'],
			}
		)

	def check_rooms(self):
		available_rooms = [room for room, clients in self.rooms.items() if len(clients) < 2]
		self.send(text_data=json.dumps({
			'type': 'available_rooms',
			'rooms': available_rooms
		}))

	def room_joined(self, event):
		self.send(text_data=json.dumps({
			'type': 'room_joined',
			'room_name': event['room_name']
		}))

	def client_joined(self, event):
		self.send(text_data=json.dumps({
			'type': 'client_joined',
			'message': event['message']
		}))

	def client_left(self, event):
		self.send(text_data=json.dumps({
			'type': 'client_left',
			'message': event['message']
		}))

	def ball_data(self, event):
		self.send(text_data=json.dumps({
			'type': 'ball_data',
			'ball_data': {
				'x': event['x'],
				'y': event['y']
			}
		}))
	
	def direction_data(self, event):
		self.send(text_data=json.dumps({
			'type': 'direction_data',
			'direction_data': {
				'dx': event['dx'],
				'dy': event['dy']
			}
		}))

	def paddle_data(self, event):
		self.send(text_data=json.dumps({
			'type': 'paddle_data',
			'paddle_data': {
				'paddle_y': event['paddle_y'],
				'playerIdx': event['playerIdx']
			}
		}))

	def player_data(self, event):
		self.send(text_data=json.dumps({
			'type': 'player_data',
			'player_data': {
				'playerReady': event['playerReady'],
				'currentServer': event['currentServer']
			}
		}))

	def game_data(self, event):
		self.send(text_data=json.dumps({
			'type': 'game_data',
			'game_data': {
				'gameStart': event['gameStart'],
				'gameReady': event['gameReady'],
				'animationFrame': event['animationFrame']	
			}
		}))