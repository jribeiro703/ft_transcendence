import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

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
		else:
			self.accept()

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

	def receive(self, text_data):
		data = json.loads(text_data)
		if data['type'] == 'join_room':
			self.join_room()
		elif data['type'] == 'ball_data':
			self.broadcast_ball_data(data)
		elif data['type'] == 'paddle_data':
			self.broadcast_paddle_data(data)
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

	def broadcast_ball_data(self, data):
		# Send ball data to room group
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'ball_data',
				'x': data['x'],
				'y': data['y'],
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
				'player': data['player'],
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
				'y': event['y'],
				'dx': event['dx'],
				'dy': event['dy']
			}
		}))

	def paddle_data(self, event):
		self.send(text_data=json.dumps({
			'type': 'paddle_data',
			'paddle_data': {
				'paddle_y': event['paddle_y'],
				'player': event['player']
			}
		}))