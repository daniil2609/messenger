from django.db import models
from django.conf import settings
'''
AUTH_USER_MODEL = getattr(settings, "AUTH_USER_MODEL", "auth.User")

class RoomType(models.TextChoices):
    direct_messages = 1, 'personal chat'
    common_channel = 2, 'group chat'


class Room(models.Model):
    name = models.CharField(max_length=128, unique=True)
    participant = models.ManyToManyField(AUTH_USER_MODEL, blank=False)
    type = models.CharField(max_length=2, choices=RoomType.choices)
    password_type = models.BooleanField(default=False)
    password = models.CharField(max_length=40, null=True, blank=True, default=None)



class Message(models.Model):
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='messages_creator')
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    text = models.CharField(blank=False, null=False, max_length=1024)
    read_users = models.ManyToManyField(AUTH_USER_MODEL, related_name='messages_read_users')
    time_message = models.DateTimeField(auto_now_add=True)
'''