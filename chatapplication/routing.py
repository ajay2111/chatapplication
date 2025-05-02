from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path 
from chatapp.consumers import TextRoomConsumers


websockets_urlpatterns  = [
    path("ws/room/", TextRoomConsumers.as_asgi())

]


application = ProtocolTypeRouter({
        "websocket" : URLRouter(websockets_urlpatterns),
    })