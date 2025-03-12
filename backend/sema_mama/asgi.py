import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import sms.routing  # Import your WebSocket routes

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sema_mama.settings")
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            sms.routing.websocket_urlpatterns
        )
    ),
})
