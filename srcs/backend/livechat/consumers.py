import json
import random
import string
from channels.generic.websocket import AsyncWebsocketConsumer
from django.apps import apps
from asgiref.sync import sync_to_async
from datetime import datetime

def generate_nickname():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=5))

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'livechat'
        self.room_group_name = 'chat_%s' % self.room_name
        self.nickname = generate_nickname()

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
                'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S')
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
        client_id = self.nickname

        # Save message to the database
        await self.save_message(client_id, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'client_id': client_id,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
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
    def save_message(self, nickname, content):
        Message = apps.get_model('livechat', 'Message')
        Message.objects.create(nickname=nickname, content=content)

    @sync_to_async
    def get_last_100_messages(self):
        Message = apps.get_model('livechat', 'Message')
        return Message.objects.order_by('-timestamp')[:100][::-1]