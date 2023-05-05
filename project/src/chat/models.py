from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class RoomType(models.TextChoices):
    direct_messages = 1, 'personal_chat'
    common_channel = 2, 'group_chat'


class Room(models.Model):
    #view_name = models.CharField(max_length=128, unique=True)
    name = models.CharField(max_length=128, unique=True)
    participant = models.ManyToManyField(User, blank=False)
    type = models.CharField(max_length=2, choices=RoomType.choices)

    @property
    def get_name(self):
        if self.type == RoomType.direct_messages:
            data = []
            for user in self.participant.all():
                data.append(user.username)
            return f'{data[0]}_{data[1]}'
        return f'{self.name}'
        


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_creator')
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    text = models.CharField(blank=False, null=False, max_length=1024)
    read_users = models.ManyToManyField(User, related_name='messages_read_users')
    time_message = models.DateTimeField(auto_now_add=True)


