"""
ASGI config for transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import livechat.routing
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import game.routing
import tournament.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence.settings')

application = ProtocolTypeRouter({
	"http": get_asgi_application(),
	"websocket": AuthMiddlewareStack(
		URLRouter(
			game.routing.websocket_urlpatterns + tournament.routing.websocket_urlpatterns + livechat.routing.websocket_urlpatterns
		)
	),
})