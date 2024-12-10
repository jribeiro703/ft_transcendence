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
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        token = text_data_json['token']
        
        try:
            # Validate token and get user info
            decoded_token = decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            User = get_user_model()
            user = await sync_to_async(User.objects.get)(id=decoded_token['user_id'])
            self.nickname = user.username
            logger.info(f"Valid token for user: {self.nickname}")
            
            # Continue with message handling
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
        except (InvalidTokenError, User.DoesNotExist) as e:
            logger.error(f"Invalid token: {str(e)}")
            await self.send(text_data=json.dumps({
                'error': 'Invalid authentication'
            }))

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
        Message.objects.create(nickname=nickname, content=content, timestamp=timestamp)

    @sync_to_async
    def get_last_100_messages(self):
        Message = apps.get_model('livechat', 'Message')
        return Message.objects.order_by('-timestamp')[:100][::-1]