from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class RoomType(models.TextChoices):
    direct_messages = 1, 'Персональный чат'
    common_channel = 2, 'Групповой чат'
    common_private_channel = 3, 'Групповой приватный чат'


class Room(models.Model):
    display_name = models.CharField(max_length=128, blank=True, null=True)
    name = models.CharField(max_length=128, unique=True)
    participant = models.ManyToManyField(User, blank=False)
    type = models.CharField(max_length=32, choices=RoomType.choices)    

    def __str__(self):
        return str(self.name)


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_creator')
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    text = models.CharField(blank=False, null=False, max_length=2048)
    read_users = models.ManyToManyField(User, related_name='messages_read_users')
    time_message = models.DateTimeField(auto_now_add=True)


class Task(models.Model):
    class boardNames(models.TextChoices):
        ToDo = 1, 'Сделать'
        InProgress = 2, 'В процессе'
        Review = 3, 'На проверке'
        Done = 4, 'Выполнено'
    owner = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='tasks')
    board_name = models.CharField(max_length=32, choices=boardNames.choices, default=boardNames.ToDo)
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=500, blank=True, null=True)
    time_create = models.DateTimeField(auto_now_add=True)

