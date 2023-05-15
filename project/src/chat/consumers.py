# chat/consumers.py
import json
from .models import Room, Message
from src.users.models import User
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.generic.websocket import JsonWebsocketConsumer
from .serializers import MessageSerializer
from django.conf import settings
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async

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
            self.close()   
            return
        if self.room == None:
            self.close()
            return
        if self.user not in self.room.participant.all():
            self.close()
            return
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        self.accept()
        #получаем 5 стартовых сообщений:
        start_messages = Message.objects.filter(room = self.room).order_by('-time_message')[:5]
        #получаем все сообщения:
        #start_messages = Message.objects.filter(room = self.room).order_by('-time_message')[:5]
        self.send(text_data=json.dumps(
            {
                "type": "start_messages",
                "message": MessageSerializer(start_messages, many=True).data
            }
        ))
        #добавляем пользователя в список онлайн и отправляем список
        settings.REDIS_CLIENT.sadd(f'{self.room_name}_onlines', bytes(self.user.username, 'utf-8'))
        self.send_online_user_list()


    def disconnect(self, code):
        settings.REDIS_CLIENT.srem(f'{self.room_name}_onlines', bytes(self.user.username, 'utf-8'))
        self.send_online_user_list()
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




    def send_online_user_list(self):
        online_user_list = settings.REDIS_CLIENT.smembers(f'{self.room_name}_onlines')
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                'type': 'online_users',
                'users': [username.decode('utf-8') for username in online_user_list],
            },         
        )
        

    def online_users(self, event):
        self.send(text_data=json.dumps(event))




'''
class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None

    async def connect(self):
        self.user = self.scope["user"]
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        self.room = await database_sync_to_async(Room.objects.filter(name=self.room_name).first)()
        #проверяем запрос
        #if not self.user.is_authenticated:
        #    self.close()   
        #    return
        #if self.room == None:
        #    self.close()
        #    return
        #if self.user not in self.room.participant.all():
        #    self.close()
        #    return
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()
        #получаем 5 стартовых сообщений:
        #start_messages = Message.objects.filter(room = self.room).order_by('-time_message')[:5]
        #self.send(text_data=json.dumps(
        #    {
        #        "type": "start_messages",
        #        "message": MessageSerializer(start_messages, many=True.data)
        #    }
        #))
        #добавляем пользователя в список онлайн и отправляем список
        settings.REDIS_CLIENT.sadd(f'{self.room_name}_onlines', bytes(self.user.username, 'utf-8'))
        self.send_online_user_list()



    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        settings.REDIS_CLIENT.srem(f'{self.room_name}_onlines', bytes(self.user.username, 'utf-8'))
        self.send_online_user_list()


    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json["type"]
        if message_type == "chat_message":
            message_text = text_data_json['message']
            message = await database_sync_to_async(Message.objects.create)(
                user=self.user,
                room=self.room,
                text=message_text,
            )
            await database_sync_to_async(message.read_users.add(self.user))
            await database_sync_to_async(message.save())

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": MessageSerializer(message).data,
                },
            )

            

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))


    async def send_online_user_list(self):
        online_user_list = settings.REDIS_CLIENT.smembers(f'{self.room_name}_onlines')
        await self.channel_layer.group_send(
            self.room_group_name, {
                'type': 'online_users',
                'users': [username.decode('utf-8') for username in online_user_list],
            },         
        )
        

    async def online_users(self, event):
        await self.send(text_data=json.dumps(event))
'''




