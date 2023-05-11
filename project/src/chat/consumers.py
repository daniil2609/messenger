# chat/consumers.py
import json
from .models import Room, Message
from src.users.models import User
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .serializers import MessageSerializer


class ChatConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None

    def connect(self):
        self.user = self.scope["user"]
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        self.room = Room.objects.filter(name=self.room_name).first()
        #проверяем запрос
        if not self.user.is_authenticated:
            return   
        if self.room == None:
            return
        if self.user not in self.room.participant.all():
            return
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )

        self.accept()

        #получаем 5 стартовых сообщений:
        start_messages = Message.objects.filter(room = self.room).order_by('-time_message')[:5]
        self.send(text_data=json.dumps(
            {
                "type": "start_messages",
                "message": MessageSerializer(start_messages, many=True).data
            }
        ))



    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json["type"]
        if message_type == "chat_message":
            message_text = text_data_json['message']
            message = Message.objects.create(
                user=self.user,
                room=self.room,
                text=message_text,
            )
            message.read_users.add(self.user)
            message.save()

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": MessageSerializer(message).data,
                },
            )
            

    def chat_message(self, event):
        self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))



'''
class ChatConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None

    def connect(self):
        
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            return
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        self.room = Room.objects.filter(name=self.room_name).first()
        if str(self.room) == 'None':
            return
        #Join room group
        self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
        self.send(text_data=json.dumps({
            "type": "welcome_message",
            "message": "Hey there! You've successfully connected!"
        }))
        
    async def disconnect(self, close_code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json["type"]
        message = text_data_json['message']
        if message_type == "chat_message":
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                }
            )
            print(message)

    def chat_message(self, event):
        message = event['message']
        print('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
        self.send(text_data=json.dumps({
            'message': message
        }))


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        """Create ChatConsumer object."""
        super().__init__(args, kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name


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

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
        '''

        