import json
import logging
import time
from threading import Timer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PongConsumer(WebsocketConsumer):
	rooms = {}
	last_active = {}
	ping_interval = 5


	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.ping_timer = None

	def connect(self):
		self.room_name = self.scope['url_route']['kwargs'].get('room_name')
		if self.room_name:
			self.room_group_name = f'game_{self.room_name}'
			async_to_sync(self.channel_layer.group_add)(
				self.room_group_name,
				self.channel_name
			)
			self.accept()
			logger.info(f'Client {self.channel_name} connected to room {self.room_name}')
		else:
			self.accept()
			logger.info(f'Client {self.channel_name} connected without a room')
		self.last_active[self.channel_name] = time.time()
		self.start_pinging()
		self.log_all_rooms()

	def disconnect(self, close_code):
		if self.room_name:
			async_to_sync(self.channel_layer.group_discard)(
				self.room_group_name,
				self.channel_name
			)
			if self.room_name in self.rooms:
				self.rooms[self.room_name].remove(self.channel_name)
				if not self.rooms[self.room_name]:
					logger.info(f'Room {self.room_name} is empty, sending room_deleted event.')
					del self.rooms[self.room_name]
					async_to_sync(self.channel_layer.group_send)(
						self.room_group_name,
						{
							'type': 'room_deleted',
							'room_name': self.room_name,
						}
					)
				else:
					logger.info(f'Client {self.channel_name} disconnected, room {self.room_name} still has clients: {self.rooms[self.room_name]}')
			self.log_all_rooms()
			# 		logger.info(f'Room {self.room_name} is now empty and has been deleted.')
			# 		self.log_all_rooms()
			# 	async_to_sync(self.channel_layer.group_send)(
			# 		self.room_group_name,
			# 		{
			# 			'type': 'client_left',
			# 			'message': f'Client {self.channel_name} has left the room.'
			# 		}
			# 	)
			# if self.channel_name in self.last_active:
			# 	del self.last_active[self.channel_name]
			# self.log_all_rooms()

	def start_pinging(self):
		"""Démarrer l'envoi de messages de ping pour vérifier la connexion."""
		self.send(text_data=json.dumps({'type': 'ping'}))
		self.ping_timer = Timer(self.ping_interval, self.check_ping_response)
		self.ping_timer.start()

	def stop_pinging(self):
		"""Arrêter le timer de ping."""
		if self.ping_timer:
			self.ping_timer.cancel()

	# def check_ping_response(self):
	# 	"""Vérifier si le client a répondu au dernier ping."""
	# 	last_time = self.last_active.get(self.channel_name)
	# 	if last_time and (time.time() - last_time > self.ping_interval):
	# 		logger.warning(f'Aucun pong reçu de {self.channel_name}. Déconnexion.')
	# 		self.close()
	# 	else:
	# 		self.start_pinging()
	# def check_ping_response(self):
	# 	last_time = self.last_active.get(self.channel_name)
	# 	if time.time() - last_time > self.ping_interval:
	# 		if self.channel_name in self.rooms.get(self.room_name, []):
	# 			self.rooms[self.room_name].remove(self.channel_name)
	# 			if not self.rooms[self.room_name]:
	# 				self.close_room(self.room_name)
	# 			self.close()
	# 		else:
	# 			self.reconnect_or_clean_client()
	def check_ping_response(self):
		last_time = self.last_active.get(self.channel_name)
		if last_time and time.time() - last_time > self.ping_interval:
			logger.warning(f'Aucun pong reçu de {self.channel_name}. Déconnexion.')
			self.disconnect()  # Déconnecte le client
			if self.room_name in self.rooms and self.channel_name in self.rooms[self.room_name]:
				self.rooms[self.room_name].remove(self.channel_name)
				if not self.rooms[self.room_name]:  # Si la room est vide
					logger.info(f'Room {self.room_name} is empty after ping check, deleting it.')
					del self.rooms[self.room_name]  # Supprime la room
					async_to_sync(self.channel_layer.group_send)(
						self.room_group_name,
						{
							'type': 'room_deleted',
							'room_name': self.room_name,
						}
					)

	def receive(self, text_data):
		data = json.loads(text_data)
		# if data['type'] != 'ball_data':
		# 	logger.info(f"Received data: {data}")
		self.last_active[self.channel_name] = time.time()
		if data['type'] == 'pong':
			logger.info(f'pong recu de {self.channel_name}')
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
		elif data['type'] == 'lobbyView':
			self.lobby()
		elif data['type'] == 'room_deleted':
			if 'room_name' in data:
				self.room_deleted(data)

	def join_room(self):
		if self.room_name not in self.rooms:
			self.rooms[self.room_name] = []
		self.rooms[self.room_name].append(self.channel_name)
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'client_joined',
				'message': f'Client {self.channel_name} has joined the room.'
			}
		)
		self.log_all_rooms()

	def log_all_rooms(self):
		for room, clients in self.rooms.items():
			logger.info(f'Room {room} has clients : {clients}')

	def lobby(self):
		available_rooms = [room for room, clients in self.rooms.items() if len(clients) == 1]
		if not available_rooms:
			logger.info(f'no room available')
			self.send(text_data=json.dumps({
			'type': 'norooms',
			}))
		else:
			logger.info(f' room available')
			self.send(text_data=json.dumps({
			'type': 'looks_rooms',
			'rooms': available_rooms,
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

	def room_deleted(self, event):
		logger.info(f"Room deleted event sent for room: {event['room_name']}")
		self.send(text_data=json.dumps({
        'type': 'room_deleted',
        'room_name': event['room_name']  # Room name as a separate field
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
				# 'animationFrame': event['animationFrame']	
			}
		}))

	def broadcast_ball_data(self, data):
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
				'type': 'game_data',
				'gameStart': data['gameStart'],
				'gameReady': data['gameReady'],
				# 'animationFrame': data['animationFrame'],
			}
		)