from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/livechat/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/livechat/(?P<room_name>\w+)/$', consumers.GameChatConsumer.as_asgi()),
]