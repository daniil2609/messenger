from django.shortcuts import render
from rest_framework import authentication, permissions, viewsets, parsers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .. import serializers
from rest_framework.views import APIView
from friendship.models import Friend, Follow, Block
from friendship.models import FriendshipRequest
from src.users.serializers import UserSerializer

class UserFriendsView(APIView):
    """ Просмотр и редактирование друзей пользователя
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Return a list friends.
        """
        print(request.user.pk)
        #user = UserSerializer
        #friends_user = Friend.objects.friends(user) # список всех друзей

        return Response('')

