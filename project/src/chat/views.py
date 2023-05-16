from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from . import serializers
from .models import Room, Message
from rest_framework import generics, viewsets, parsers, views
from django.db.models import Q
from django.shortcuts import get_object_or_404
from transliterate import slugify
import re
from friendship.models import Friend


User = get_user_model()

class ListRoomView(generics.ListAPIView):
    """ Список всех чатов пользователя
    """
    serializer_class = serializers.RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        #return Room.objects.filter(Q(name__icontains='_'+str(request.user.pk)+'_') | Q(participant=request.user.pk))
        return Room.objects.filter(participant=self.request.user.pk)

class SearchChatRoomView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        """
        Ищет в базе комнаты чатов по запросу
        Возвращает список из 20(max) подходящих записей
        """
        serializer = serializers.RoomSearchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message=serializer.validated_data.get('message')
        search_results = Room.objects.filter(name__icontains=message, type=2).exclude(participant=self.request.user.pk)[:20]
        return Response(serializers.RoomSerializer(search_results, many=True).data)


class EnterChatRoomView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, id=None):
        """
        Добавляет пользователя в групповой чат
        (нужен id чата)
        """
        id=request.data.get('id')
        room = get_object_or_404(Room, pk=id)
        room.participant.add(request.user)
        room.save()
        return Response({"detail": "Request accepted, user added to room"}, status.HTTP_201_CREATED)


class DeleteChatRoomView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def delete(self, request, id=None):
        """
        Удаляет пользователя из чата (только для групповых чатов)
        (нужен id чата)
        удаляет сам чат если из него выходит последний пользователь
        """
        id=request.data.get('id')
        user = get_object_or_404(User, pk=request.user.pk)
        room = get_object_or_404(Room, pk=id)
        #при удалении группового чата пользователь выходит из него
        #если там последний пользователь то чат удаляется
        if room.type == '2':
            if room.participant.count() == 1:
                room.delete()
                return Response({"detail": "Request accepted, room has been deleted"}, status.HTTP_201_CREATED)
            else:
                room.participant.remove(user)
                room.save()
                return Response({"detail": "Request accepted, user deleted to room"}, status.HTTP_201_CREATED)
        #при удалении личного чата удаляется друг
        #если там последний пользователь то чат удаляется
        else:
            if room.participant.count() == 1:
                room.delete()
                return Response({"detail": "Request accepted, room has been deleted"}, status.HTTP_201_CREATED)
            else:
                room.participant.remove(user)
                room.save()
                to_user = room.participant.all()[0]
                Friend.objects.remove_friend(user, to_user)
                return Response({"detail": "Request accepted, user deleted to room"}, status.HTTP_201_CREATED)


class CreateChatRoomView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        """
        Создает групповой чат
        (нужно имя чата)
        """
        serializer = serializers.RoomNameSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        name_chat = serializer.validated_data.get('name')

        #проверяем есть ли русские буквы в названии чата
        def is_cyrrylic(symb):
            return True if u'\u0400' <= symb <=u'\u04FF' or u'\u0500' <= symb <= u'\u052F' else False
        rus = False
        for i in name_chat:
            a = is_cyrrylic(i)
            if a == True:
                rus = True
                break
        #если есть транслитерируем имя
        if rus:
            disp_name = name_chat
            url_name = slugify(name_chat)
        else:
            disp_name = name_chat
            url_name = name_chat
        #создаем неповторяющеесе имя чата добавляя счетчик
        c = 1
        while Room.objects.filter(name=url_name).first() is not None:
            if c == 1:
                url_name = url_name+str(c)
            else:
                url_name = re.sub(r'[^\w\s]+|[\d]+', r'', url_name).strip()+str(c)
            c+=1
        #создаем комнату
        user = get_object_or_404(User, pk=request.user.pk)
        room = Room.objects.create(
            display_name = disp_name,
            name = url_name,
            type = 2
        )
        room.participant.add(user)
        room.save()
        return Response({"detail": "Request accepted, room was created"}, status.HTTP_201_CREATED)


class AddUserInRoom(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, room=None):
        """
        Добавляет пользователей в групповой чат
        (нужно имя или id чата и id пользователей(в списке))
        """
        id=request.data.get('id')
        name_json=request.data.get('name', None)
        participant_list=request.data.get('participant')
        if name_json is not None:
            serializer = serializers.RoomNameSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            name_room = serializer.validated_data.get('name')
            room = get_object_or_404(Room, name=name_room)
        if id is not None:
            room = get_object_or_404(Room, pk=id)
        if room is not None:
            if room.type == '2':
                my_user = User.objects.get(pk=request.user.pk)
                if my_user in room.participant.all():
                    for user_id in participant_list:
                        another_user = get_object_or_404(User, pk=user_id)
                        if Friend.objects.are_friends(my_user, another_user):
                            room.participant.add(another_user)
                            room.save()
                            return Response({"detail": "Request accepted, all users have been added"}, status.HTTP_201_CREATED)
                        else:
                            return Response({"detail": "The user is not your friend"}, status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"detail": "Request rejected, you are not a member of this room"}, status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"detail": "Request rejected, you can only add users to the common room"}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Request rejected, room not found"}, status.HTTP_400_BAD_REQUEST)


