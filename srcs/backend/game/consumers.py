import json
import logging
import time
from threading import Timer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RoomManager:
    """Classe pour gérer les salles et les utilisateurs."""
    def __init__(self):
        self.rooms = {}

    def add_client_to_room(self, room_name, client_channel):
        if room_name not in self.rooms:
            self.rooms[room_name] = []
        self.rooms[room_name].append(client_channel)

    def remove_client_from_room(self, room_name, client_channel):
        if room_name in self.rooms and client_channel in self.rooms[room_name]:
            self.rooms[room_name].remove(client_channel)
            if not self.rooms[room_name]:  # Supprime la salle si elle est vide
                del self.rooms[room_name]

    def get_room_info(self):
        """Retourne la liste des salles et leur nombre de clients."""
        return {room: len(clients) for room, clients in self.rooms.items()}


class PongConsumer(WebsocketConsumer):
	room_manager = RoomManager()
	last_active = {}
	ping_interval = 10

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.ping_timer = None
	
	def connect(self):
		self.room_name = self.scope['url_route']['kwargs'].get('room_name')
		self.channel_name = self.channel_name

		if self.room_name:
			self.room_group_name = f'game_{self.room_name}'
			async_to_sync(self.channel_layer.group_add)(
				self.room_group_name,
				self.channel_name
			)
			self.accept()
			logger.info(f'Client {self.channel_name} connected to room {self.room_name}')
			self.room_manager.add_client_to_room(self.room_name, self.channel_name)
		else:
			self.accept()
			logger.info(f'Client {self.channel_name} connected without a room')

		self.last_active[self.channel_name] = time.time()
		self.start_pinging()
		self.log_all_rooms()

	def disconnect(self, close_code):
		if self.room_name:
			logger.info(f'Client {self.channel_name} disconnected from room {self.room_name}')
			async_to_sync(self.channel_layer.group_discard)(
				self.room_group_name,
				self.channel_name
			)
			self.room_manager.remove_client_from_room(self.room_name, self.channel_name)
			async_to_sync(self.channel_layer.group_send)(
					self.room_group_name,
					{
						'type': 'client_left',
						'message': f'Client {self.channel_name} has left the room.'
					}
			)
			self.update_room_info()
			if self.channel_name in self.last_active:
				del self.last_active[self.channel_name]  

	def start_pinging(self):
		"""Démarrer l'envoi de messages de ping pour vérifier la connexion."""
		self.send(text_data=json.dumps({'type': 'ping'}))
		self.ping_timer = Timer(self.ping_interval, self.check_ping_response)
		self.ping_timer.start()

	def stop_pinging(self):
		"""Arrêter le timer de ping."""
		if self.ping_timer:
			self.ping_timer.cancel()

	def check_ping_response(self):
		"""Vérifier si le client a répondu au dernier ping."""
		last_time = self.last_active.get(self.channel_name)
		if last_time and (time.time() - last_time > self.ping_interval):
			logger.warning(f'Aucun pong reçu de {self.channel_name}. Déconnexion.')
			self.close()  # Déconnecter le client si aucun pong reçu
		else:
			self.start_pinging()
	
	def receive(self, text_data):
		data = json.loads(text_data)
		self.last_active[self.channel_name] = time.time()  # Mettre à jour l'activité
		if data['type'] == 'pong':
			logger.info(f'Pong reçu de {self.channel_name}')
		elif data['type'] == 'join_room':
			self.join_room()
		elif data['type'] in ['ball_data', 'direction_data', 'paddle_data', 'player_data', 'game_data', 'room_data']:
			self.broadcast_data(data)
		elif data['type'] == 'check_rooms':
			self.check_rooms()

	def join_room(self):
		if self.room_name not in self.room_manager.rooms:
			self.room_manager.rooms[self.room_name] = []
		self.room_manager.add_client_to_room(self.room_name, self.channel_name)
		# Send message to room group
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'client_joined',
				'message': f'Client {self.channel_name} has joined the room.'
			}
		)
		self.log_all_rooms()

	def log_all_rooms(self):
		"""Journaliser l'état actuel de toutes les salles."""
		rooms_info = self.room_manager.get_rooms_info()
		for room, count in rooms_info.items():
			logger.info(f'Room {room} has {count} clients.')

	# def log_all_rooms(self):
	# 	for room, clients in self.rooms.items():
	# 		logger.info(f'Room {room} has clients : {clients}')

	def broadcast_data(self, data):
		"""Diffuser des données spécifiques à la salle."""
		message_type = data['type']
		async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': message_type,
                **data  # Envoie toutes les données reçues
            }
        )


	# def broadcast_ball_data(self, data):
	# 	# Send ball data to room group
	# 	async_to_sync(self.channel_layer.group_send)(
	# 		self.room_group_name,
	# 		{
	# 			'type': 'ball_data',
	# 			'x': data['x'],
	# 			'y': data['y'],
	# 		}
	# 	)

	# def broadcast_direction_data(self, data):
	# 	async_to_sync(self.channel_layer.group_send)(
	# 		self.room_group_name,
	# 		{
	# 			'type': 'direction_data',
	# 			'dx': data['dx'],
	# 			'dy': data['dy'],
	# 		}
	# 	)

	# def broadcast_paddle_data(self, data):
	# 	# Send paddle data to room group
	# 	async_to_sync(self.channel_layer.group_send)(
	# 		self.room_group_name,
	# 		{
	# 			'type': 'paddle_data',
	# 			'paddle_y': data['paddle_y'],
	# 			'playerIdx': data['playerIdx'],
	# 		}
	# 	)

	# def broadcast_player_data(self, data):
	# 	async_to_sync(self.channel_layer.group_send)(
	# 		self.room_group_name,
	# 		{
	# 			'type': 'player_data',
	# 			'playerReady': data['playerReady'],
	# 			'currentServer': data['currentServer'],
	# 		}
	# 	)

	# def broadcast_game_data(self, data):
	# 	async_to_sync(self.channel_layer.group_send)(
	# 		self.room_group_name,
	# 		{
	# 			'type': 'player_data',
	# 			'gameStart': data['gameStart'],
	# 			'gameReady': data['gameReady'],
	# 			'animationFrame': data['animationFrame'],
	# 		}
	# 	)
	
	# def broadcast_room_data(self, data):
	# 	async_to_sync(self.channel_layer.group_send)(
	# 		self.room_group_name,
	# 		{
	# 			'type': 'room_data',
	# 			'idx': data['idx'],
	# 			'name': data['name'],
	# 			'nbPlayer': data['nbPlayer'],
	# 			'status': data['status'],
	# 		}
	# 	)

	def check_rooms(self):
		available_rooms = [room for room, clients in self.rooms.items() if len(clients) < 2]
		self.send(text_data=json.dumps({
			'type': 'available_rooms',
			'rooms': available_rooms
		}))


	def broadcast_client_left(self):
		"""Notifier les autres clients lorsqu'un client se déconnecte."""
		async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'client_left',
                'message': f'Client {self.channel_name} has left the room.'
            }
        )


	# def room_joined(self, event):
	# 	self.send(text_data=json.dumps({
	# 		'type': 'room_joined',
	# 		'room_name': event['room_name']
	# 	}))

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

	def room_data(self, event):
		self.send(text_data=json.dumps({
			'type': 'room_data',
			'room_data': {
				'idx': event['idx'],
				'name': event['name'],
				'nbPlayer': event['nbPlayer'],
				'status': event['status']
			}
		}))