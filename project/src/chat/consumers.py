# chat/consumers.py
import json
from . utils import encrypt
from .models import Room, Message, Task
from src.users.models import User
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.generic.websocket import JsonWebsocketConsumer
from .serializers import MessageSerializer, KanbanTaskSerializer, RoomSerializer
from src.users.serializers import UserSerializer
from django.conf import settings
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async

COUNT_PAGINATE = 5



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
        #выводим стартовые сообщения без прочитанного
        start_messages = Message.objects.filter(room = self.room).order_by('-pk')[:COUNT_PAGINATE]
        self.send(text_data=json.dumps(
            {
                "type": "start_messages",
                "message": MessageSerializer(start_messages, many=True).data
            }
        ))

        #добавляем пользователя в список онлайн и отправляем список
        settings.REDIS_CLIENT.sadd(f'{self.room_name}_onlines', bytes(self.user.email, 'utf-8'))
        self.send_online_user_list()


    def disconnect(self, code):
        settings.REDIS_CLIENT.srem(f'{self.room_name}_onlines', bytes(self.user.email, 'utf-8'))
        self.send_online_user_list()
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        #self.send_online_user_list()
        text_data_json = json.loads(text_data)
        message_type = text_data_json["type"]
        if message_type == "chat_message":
            message_text = encrypt(text_data_json['message']) #шифруем сообщение
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

            async_to_sync(self.channel_layer.group_send)(
                f'{self.room_name}_notifications',
                {
                    "type": "notification",
                    "room": RoomSerializer(self.room).data,
                    "message": MessageSerializer(message).data,
                },
            )
            
        if message_type == "paginate_up":
            end_id = text_data_json['up_id']
            messages = Message.objects.filter(room=self.room, pk__lt=end_id).order_by('-pk')[:COUNT_PAGINATE]

            self.send(text_data=json.dumps(
                {
                    "type": "paginate_up",
                    "message": MessageSerializer(messages, many=True).data
                }
            ))
        '''
        if message_type == "paginate_down":
            end_id = text_data_json['down_id']
            messages = Message.objects.filter(room=self.room, pk__gt=end_id).order_by('pk')[:COUNT_PAGINATE]

            self.send(text_data=json.dumps(
                {
                    "type": "paginate_down",
                    "message": MessageSerializer(messages, many=True).data
                }
            ))
      '''
        
    def chat_message(self, event):
        self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))

    def send_online_user_list(self):
        redis_online_user_list = settings.REDIS_CLIENT.smembers(f'{self.room_name}_onlines')#достаем из redis
        arr_online_user_list = [useremail.decode('utf-8') for useremail in redis_online_user_list]#декодируем
        online_user_list = [User.objects.filter(email=i).first() for i in arr_online_user_list]#ищем пользователей в БД
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                'type': 'online_users',
                'users': UserSerializer(online_user_list, many=True).data,
            },
        )
        
    def online_users(self, event):
        self.send(text_data=json.dumps(event))




class NotificationConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user_rooms = None
        self.user = None

    def connect(self):
        self.user = self.scope["user"]
        self.user_rooms = Room.objects.filter(participant=self.user.pk)

        #проверяем запрос
        if not self.user.is_authenticated:
            self.close()   
            return
        if self.user_rooms.count() != 0:
            for room in self.user_rooms:
                async_to_sync(self.channel_layer.group_add)(
                    f'{room.name}_notifications',
                    self.channel_name,
                )
        self.accept()

    def disconnect(self, code):
        if self.user_rooms.count() != 0:
            for room in self.user_rooms:
                async_to_sync(self.channel_layer.group_discard)(
                    f'{room.name}_notifications',
                    self.channel_name,
                )

    def notification(self, event):
        self.send(text_data=json.dumps({
            'type': 'notification',
            'message': event['message'],
            'room': event['room'],
            }))


class KanbanBoardConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.board = None

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'board_%s' % self.room_name
        self.room = Room.objects.filter(name=self.room_name).first()
        #проверяем запрос
        if self.room == None:
            self.close()
            return
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        self.accept()
        #получаем все задачи доски:
        self.board = Task.objects.filter(owner=self.room)
        self.send(text_data=json.dumps(
            {
                "type": "board",
                "ToDo": KanbanTaskSerializer(self.board.filter(board_name=1), many=True).data,
                "InProgress": KanbanTaskSerializer(self.board.filter(board_name=2), many=True).data,
                "Review": KanbanTaskSerializer(self.board.filter(board_name=3), many=True).data,
                "Done": KanbanTaskSerializer(self.board.filter(board_name=4), many=True).data,
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
        if message_type == "add":
            type_task = text_data_json['type_task']
            name_task = (text_data_json['name_task'], None)
            description_task = text_data_json['description_task']
            if type_task == "ToDo":
                name_board = 1
            elif type_task == "InProgress":
                name_board = 2
            elif type_task == "Review":
                name_board = 3
            elif type_task == "Done":
                name_board = 4
            else:
                name_board = 1
            if name_task != None:
                encrypt_name_task = encrypt(name_task)#encrypt для шифрования
                Task.objects.create(
                    owner=self.room,
                    board_name=name_board,
                    name=encrypt_name_task,
                    description=encrypt(description_task)#encrypt для шифрования
                )
                self.send_all_board()
            else:
                self.send_error('You must specify the name of the task')

        if message_type == "delete":
            id_task = text_data_json['id_task']
            Task.objects.filter(pk=id_task).delete()
            self.send_all_board()

        if message_type == "edit":
            id_task = text_data_json['id_task']
            new_name_task = (text_data_json['new_name_task'], None)
            new_description_task = (text_data_json['new_description_task'], None)
            if new_description_task == None and new_name_task == None:
                self.send_error('To edit, you need at least one thing')
            else:
                if new_name_task != "":
                    Task.objects.filter(pk=id_task).update(name=encrypt(new_name_task))#encrypt для шифрования
                if new_description_task != "":
                    Task.objects.filter(pk=id_task).update(description=encrypt(new_description_task))#encrypt для шифрования
                self.send_all_board()

        if message_type == "move":
            id_task = text_data_json['id_task']
            new_type_task = text_data_json['new_type_task']
            if new_type_task == "ToDo":
                name_board = 1
            elif new_type_task == "InProgress":
                name_board = 2
            elif new_type_task == "Review":
                name_board = 3
            elif new_type_task == "Done":
                name_board = 4
            else:
                name_board = 1
            Task.objects.filter(pk=id_task).update(board_name=name_board)
            self.send_all_board()

    def send_all_board(self):
        self.board = Task.objects.filter(owner=self.room)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "board",
                "ToDo": KanbanTaskSerializer(self.board.filter(board_name=1), many=True).data,
                "InProgress": KanbanTaskSerializer(self.board.filter(board_name=2), many=True).data,
                "Review": KanbanTaskSerializer(self.board.filter(board_name=3), many=True).data,
                "Done": KanbanTaskSerializer(self.board.filter(board_name=4), many=True).data,
            },
        )

    def board(self, event):
        self.send(text_data=json.dumps({
            'type': 'board',
            'ToDo': event['ToDo'],
            'InProgress': event['InProgress'],
            'Review': event['Review'],
            'Done': event['Done'],
            }))
    
    def send_error(self, message):
        self.send(text_data=json.dumps({
            'type': 'Kanban_error',
            'message': message,
            }))

