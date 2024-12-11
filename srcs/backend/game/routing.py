from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/gamechat/(?P<room_name>\w+)/$', consumers.GameChatConsumer.as_asgi()),
    re_path(r'ws/pong/(?P<room_name>\w+)/$', consumers.PongConsumer.as_asgi()),
    re_path(r'ws/pong/check_rooms/$', consumers.PongConsumer.as_asgi()),
]