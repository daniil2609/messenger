from django.contrib.auth import get_user_model
from rest_framework import serializers
from friendship.models import FriendshipRequest
from .models import Room, Message


class RoomSerializer(serializers.ModelSerializer):
    chat_name = serializers.ReadOnlyField(source='get_name')
    
    class Meta:
        model = Room
        fields = ('id', 'chat_name', 'name', 'participant', 'type')

#class MessageSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Message
#        fields = ('id', 'user', 'room', 'text', 'read_users', 'time_message')

class RoomSearchSerializer(serializers.Serializer):
    message = serializers.CharField(max_length = 100)


class RoomNameSerializer(serializers.Serializer):
    name = serializers.CharField(max_length = 128)




