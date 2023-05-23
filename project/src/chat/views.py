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
        return Room.objects.filter(participant=self.request.user.pk)



class SearchChatRoomView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        """
        Ищет в базе комнаты чатов по запросу
        Возвращает список из 20(max) подходящих записей
        """
        serializer = serializers.RoomSearchMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message=serializer.validated_data.get('message')
        #поиск и своих и новых чатов
        #search_results = Room.objects.filter(Q(name__icontains=message, type=2) | Q(display_name__icontains=message, type=2))[:20]
        search_results = Room.objects.filter(Q(name__icontains=message, type=2) | Q(display_name__icontains=message, type=2)).exclude(participant=request.user)[:20]
        return Response(serializers.RoomSearchSerializer(search_results, many=True, context={'user': request.user}).data)


class EnterChatRoomView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, id=None):
        """
        Добавляет пользователя в групповой чат
        (нужен id чата)
        """
        id=request.data.get('id')
        room = get_object_or_404(Room, pk=id)
        if room.type == '2':
            room.participant.add(request.user)
            room.save()
            return Response({"detail": "Request accepted, user added to room"}, status.HTTP_201_CREATED)
        else:
            return Response({"detail": "You can only join public shared chats"}, status.HTTP_403_FORBIDDEN)


class DeleteChatRoomView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, id=None):
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
        if user in room.participant.all():
            if room.type == '2' or room.type == '3':
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
        else:
            return Response({"detail": "Request rejected, the user is not in the chat"}, status.HTTP_400_BAD_REQUEST)


class CreateChatRoomView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        """
        Создает групповой чат
        (нужно имя чата)
        """
        serializer = serializers.RoomNameAndTypeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        name_chat = serializer.validated_data.get('name')
        type_chat = serializer.validated_data.get('type')

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
            url_name = url_name.replace('-', '_')
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
        if type_chat == '2':
            room = Room.objects.create(
                display_name = disp_name,
                name = url_name,
                type = 2
            )
            room.participant.add(user)
            room.save()
            return Response({"detail": "Request accepted, room was created"}, status.HTTP_201_CREATED)
        elif type_chat == '3':
            room = Room.objects.create(
                display_name = disp_name,
                name = url_name,
                type = 3
            )
            room.participant.add(user)
            room.save()
            return Response({"detail": "Request accepted, room was created"}, status.HTTP_201_CREATED)
        else:
            return Response({"detail": "Incorrect chat type"}, status.HTTP_400_BAD_REQUEST)


class AddUserInRoom(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, room=None):
        """
        Добавляет пользователей в групповой чат
        (нужно id чата и id пользователей(в списке))
        """
        id=request.data.get('id')
        participant_list=request.data.get('participant')
        if id is not None:
            room = get_object_or_404(Room, pk=id)
        if room is not None:
            if room.type == '2' or room.type == '3':
                my_user = User.objects.get(pk=request.user.pk)
                if my_user in room.participant.all():
                    add_users = []
                    for user_id in participant_list:
                        another_user = get_object_or_404(User, pk=user_id)
                        if Friend.objects.are_friends(my_user, another_user):
                            room.participant.add(another_user)
                            room.save()
                            add_users.append(another_user.pk)
                    return Response({"detail": f"Users have been added: {add_users}"}, status.HTTP_201_CREATED)
                else:
                    return Response({"detail": "Request rejected, you are not a member of this room"}, status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"detail": "Request rejected, you can only add users to the common room"}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Request rejected, room not found"}, status.HTTP_400_BAD_REQUEST)


class EditNameChat(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        """
        Изменяет display_name чата
        (нужно id чата)
        """
        id_chat=request.data.get('id')
        serializer = serializers.RoomNameSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        name_chat = serializer.validated_data.get('name')
        if id_chat is not None:
            room = get_object_or_404(Room, pk=id_chat)
        if room is not None:
            if room.type == '2' or room.type == '3':
                my_user = User.objects.get(pk=request.user.pk)
                if my_user in room.participant.all():
                    room.display_name = name_chat
                    room.save()
                    return Response({"detail": "You have successfully changed the name"}, status.HTTP_201_CREATED)
                else:
                    return Response({"detail": "Request rejected, you are not a member of this room"}, status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"detail": "Request rejected, you can only add users to the common room"}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Request rejected, room not found"}, status.HTTP_400_BAD_REQUEST)


class GetParticipantRoom(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        """
        Изменяет display_name чата
        (нужно id чата)
        """
        name_chat=request.query_params['room_name']
        partipicant = get_object_or_404(Room, name=name_chat).participant
        return Response(serializers.UserSerializer(partipicant, many=True).data, status.HTTP_200_OK)
            