import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import WebsocketConsumer


class TextRoomConsumers(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat %s' % self.room_name

        sync_to_async(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name

        )
        self.accept()

    def disconnect(self, code):
        sync_to_async(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name

        )
    
    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        text  = text_data_json["text"]
        sender = text_data_json["sender"]
        sync_to_async(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type' : "chat message",
                'message' : text,
                "sender" : sender,

            }

        )
    
    def chat_message(self, event):
        text  = event["message"]
        sender = event["sender"]

        self.send(text_json= json.dumps(
            {
                "text" : text,
                "sender" : sender,
            }
        ))
        