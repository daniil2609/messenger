from django.contrib.auth import get_user_model
from rest_framework import serializers
from friendship.models import FriendshipRequest
from .models import Room, Message
from src.users.serializers import UserSerializer

User = get_user_model()

class RoomSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Room
        fields = ('id', 'display_name', 'name', 'participant', 'type')

class RoomSearchSerializer(serializers.Serializer):
    message = serializers.CharField(max_length = 100)


class RoomNameSerializer(serializers.Serializer):
    name = serializers.CharField(max_length = 128)


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    time_message = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model = Message
        fields = ('user', 'text', 'time_message')

    def get_user(self, obj):
        return UserSerializer(obj.user).data


