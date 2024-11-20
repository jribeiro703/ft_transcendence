import json
import random
import string
from channels.generic.websocket import AsyncWebsocketConsumer

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

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'client_id': client_id
            }
        )

    async def chat_message(self, event):
        message = event['message']
        client_id = event['client_id']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'client_id': client_id
        }))