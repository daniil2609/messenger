from django.contrib.auth import get_user_model
from rest_framework import serializers
from friendship.models import FriendshipRequest
from .models import Room, Message, Task
from src.users.serializers import UserSerializer
from . utils import decrypt

User = get_user_model()

class RoomSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Room
        fields = ('id', 'display_name', 'name', 'participant', 'type')


class RoomSearchSerializer(serializers.ModelSerializer): 
    room_user_type = serializers.SerializerMethodField()
    class Meta:
        model = Room
        fields = ('id', 'display_name', 'name', 'room_user_type', 'type')

    def get_room_user_type(self, obj):
        user_my = self.context.get('user', None)
        to_room_my = obj

        if user_my in to_room_my.participant.all():
            return str('your_chat')
        else:
            return str('new_chat')


class RoomNameSerializer(serializers.Serializer):
    name = serializers.CharField(max_length = 128)


class RoomNameAndTypeSerializer(serializers.Serializer):
    name = serializers.CharField(max_length = 128)
    type = serializers.CharField(max_length = 1)


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    time_message = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    text = serializers.SerializerMethodField()
    class Meta:
        model = Message
        fields = ('id', 'user', 'text', 'time_message')

    def get_user(self, obj):
        return UserSerializer(obj.user).data
    def get_text(self, obj):
        return decrypt(obj.text)#расшифровываем сообщение
    

class KanbanTaskSerializer(serializers.ModelSerializer):
    time_create = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    class Meta:
        model = Task
        fields = ('id', 'name', 'description', 'time_create')

    def get_name(self, obj):
        return decrypt(obj.name)#расшифровываем имя задачи
    
    def get_description(self, obj):
        return decrypt(obj.description)#расшифровываем описание задачи

