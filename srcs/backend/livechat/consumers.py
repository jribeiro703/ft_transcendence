import json
import random
import string
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from jwt import decode, InvalidTokenError
from django.conf import settings
from urllib.parse import parse_qs
from django.apps import apps
from asgiref.sync import sync_to_async
from django.utils import timezone
import logging

logger = logging.getLogger('websocket')

# def generate_nickname():
#     return ''.join(random.choices(string.ascii_letters + string.digits, k=5))

class ChatConsumer(AsyncWebsocketConsumer):
    # Class variable to track connections per user
    user_connections = {}

    async def connect(self):
        self.room_name = 'livechat'
        self.room_group_name = 'chat_%s' % self.room_name
        # self.nickname = generate_nickname()

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Send the last 100 messages to the client
        messages = await self.get_last_100_messages()
        for message in messages:
            await self.send(text_data=json.dumps({
                'message': message.content,
                'client_id': message.nickname,
                'timestamp': message.timestamp.isoformat()
            }))

    async def disconnect(self, close_code):
        try:
            # Only update status if user was authenticated
            if hasattr(self, 'user') and hasattr(self, 'nickname'):
                user_id = self.user.id
                # Decrement connection count
                if user_id in ChatConsumer.user_connections:
                    ChatConsumer.user_connections[user_id] -= 1
                    connections = ChatConsumer.user_connections[user_id]
                    
                    # If this was the last connection, set user offline
                    if connections <= 0:
                        User = get_user_model()
                        user = await sync_to_async(User.objects.get)(id=user_id)
                        user.is_online = False
                        user.last_activity = timezone.now()
                        await sync_to_async(user.save)()
                        del ChatConsumer.user_connections[user_id]
                        logger.info(f"User {self.nickname} disconnected (last connection)")
                    else:
                        logger.info(f"User {self.nickname} disconnected ({connections} connections remaining)")

            # Leave room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            logger.error(f"Error in disconnect: {str(e)}")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        
        # Handle authentication message
        if text_data_json.get('type') == 'authenticate':
            try:
                token = text_data_json.get('token')
                if not token:
                    raise InvalidTokenError("Token is missing or null")

                decoded_token = decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                User = get_user_model()
                user = await sync_to_async(User.objects.get)(id=decoded_token['user_id'])
                
                # Store user info in consumer instance
                self.user = user
                self.nickname = user.username
                
                # Update user status
                user.is_online = True
                user.last_activity = timezone.now()
                await sync_to_async(user.save)()
                
                # After authentication, increment connection count
                user_id = self.user.id
                ChatConsumer.user_connections[user_id] = ChatConsumer.user_connections.get(user_id, 0) + 1
                logger.info(f"User {self.nickname} connections: {ChatConsumer.user_connections[user_id]}")
                
                logger.info(f"User {self.nickname} authenticated via WebSocket")
                return
                
            except InvalidTokenError as e:
                logger.error(f"WebSocket authentication failed: Invalid token - {str(e)}")
                await self.send(text_data=json.dumps({
                    'error': 'Invalid token'
                }))
                return
            except get_user_model().DoesNotExist as e:
                logger.error(f"WebSocket authentication failed: User does not exist - {str(e)}")
                await self.send(text_data=json.dumps({
                    'error': 'User does not exist'
                }))
                return
        
        # Handle regular messages
        elif 'message' in text_data_json:
            message = text_data_json['message']
            if not hasattr(self, 'nickname'):
                await self.send(text_data=json.dumps({
                    'error': 'Not authenticated'
                }))
                return
                
            timestamp = timezone.now().isoformat()
            await self.save_message(self.nickname, message, timestamp)
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'client_id': self.nickname,
                    'timestamp': timestamp
                }
            )

    async def chat_message(self, event):
        message = event['message']
        client_id = event['client_id']
        timestamp = event['timestamp']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'client_id': client_id,
            'timestamp': timestamp
        }))

    @sync_to_async
    def save_message(self, nickname, content, timestamp):
        Message = apps.get_model('livechat', 'Message')
        Message.objects.create(nickname=nickname, content=content, timestamp=timestamp, is_game_chat=False)

    @sync_to_async
    def get_last_100_messages(self):
        Message = apps.get_model('livechat', 'Message')
        return Message.objects.filter(
            is_game_chat=False  # Only get regular chat messages
        ).order_by('-timestamp')[:100][::-1]

class GameChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get room name from URL parameters
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'game_chat_{self.room_name}'

        # Validate room name format
        if not self.room_name.startswith('room_'):
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        try:
            # Send last 100 messages for this specific room
            messages = await self.get_last_100_messages()
            for message in await sync_to_async(list)(messages):
                await self.send(text_data=json.dumps({
                    'message': message.content,
                    'client_id': message.nickname,
                    'timestamp': message.timestamp.isoformat()
                }))
        except Exception as e:
            logger.error(f"Error sending messages: {str(e)}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        logger.info(f"received text {text_data}")
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        token = text_data_json['token']
        
        try:
            # Validate token and get user info
            decoded_token = decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            User = get_user_model()
            user = await sync_to_async(User.objects.get)(id=decoded_token['user_id'])
            self.nickname = user.username
            logger.info(f"Valid token for user {self.nickname} in room {self.room_name}")
            
            timestamp = timezone.now().isoformat()
            await self.save_message(self.nickname, message, timestamp)
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'client_id': self.nickname,
                    'timestamp': timestamp,
                    'room': self.room_name
                }
            )
        except InvalidTokenError as e:
            logger.error(f"Invalid token in room {self.room_name}: {str(e)}")
            await self.send(text_data=json.dumps({
                'error': 'Invalid authentication'
            }))
        except get_user_model().DoesNotExist as e:
            logger.error(f"User does not exist in room {self.room_name}: {str(e)}")
            await self.send(text_data=json.dumps({
                'error': 'User does not exist'
            }))

    async def chat_message(self, event):
        message = event['message']
        client_id = event['client_id']
        timestamp = event['timestamp']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'client_id': client_id,
            'timestamp': timestamp,
            'room': self.room_name
        }))

    @sync_to_async
    def save_message(self, nickname, content, timestamp):
        Message = apps.get_model('livechat', 'Message')
        Message.objects.create(
            nickname=nickname,
            content=content,
            timestamp=timestamp,
            room=self.room_name,
            is_game_chat=True
        )
    
    @sync_to_async
    def get_last_100_messages(self):
        Message = apps.get_model('livechat', 'Message')
        return list(Message.objects.filter(
            room=self.room_name,
            is_game_chat=True
        ).order_by('-timestamp'))