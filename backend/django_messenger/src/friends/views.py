from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from friendship.models import Friend, FriendshipRequest
from friendship.exceptions import AlreadyExistsError, AlreadyFriendsError
from .serializers import *
from django.db.models import Q

User = get_user_model()


class FriendViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FriendSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return self.request.user

    def get_object(self):
        return self.get_queryset()
    
    def list(self, request):
        '''
        выводит список друзей
        '''
        friend_requests = Friend.objects.friends(user=request.user)
        self.queryset = friend_requests
        self.http_method_names = ['get']
        return Response(FriendSerializer(friend_requests, many=True).data)


    def retrieve(self, request, pk=None):
        response = {'message': 'This function is not serviced.'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


    @ action(detail=False)
    def requests(self, request):
        '''
        просмотр входящих запросов в друзья
        '''
        friend_requests = Friend.objects.unrejected_requests(user=request.user)
        self.queryset = friend_requests
        return Response(
            FriendshipRequestSerializer(friend_requests, many=True).data)

    @ action(detail=False)
    def sent_requests(self, request):
        '''
        просмотр исходящих запросов в друзья (даже тех которые уже приняты)
        '''
        friend_requests = Friend.objects.sent_requests(user=request.user)
        self.queryset = friend_requests
        return Response(
            FriendshipRequestSerializer(friend_requests, many=True).data)

    @ action(detail=False)
    def rejected_requests(self, request):
        '''
        просмотр отклоненных ранее запросов в друзья
        '''
        friend_requests = Friend.objects.rejected_requests(user=request.user)
        self.queryset = friend_requests
        return Response(
            FriendshipRequestSerializer(friend_requests, many=True).data)

    @ action(detail=False,
             serializer_class=FriendshipRequestSerializer,
             methods=['post'])
    def add_friend(self, request, username=None):
        """
        Добавляет нового друга
        - to_user (email)
        - message
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        to_user = get_object_or_404(
            User,
            email=serializer.validated_data.get('to_user')
        )

        try:
            friend_obj = Friend.objects.add_friend(
                request.user,
                to_user,
                message=request.data.get('message', '')
            )
            return Response(
                FriendshipRequestSerializer(friend_obj).data,
                status.HTTP_201_CREATED
            )
        except (AlreadyExistsError, AlreadyFriendsError) as e:
            return Response(
                {"message": str(e)},
                status.HTTP_400_BAD_REQUEST
            )

    @ action(detail=False, serializer_class=FriendshipRequestSerializer, methods=['post'])
    def remove_friend(self, request):
        """
        Удаляет дружеские отношения.
        Имя пользователя, указанное в данных POST, будет
        удалено из списка друзей текущего пользователя.
        
        - to_user (email)
        - message
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        to_user = get_object_or_404(
            User,
            email=serializer.validated_data.get('to_user')
        )

        if Friend.objects.remove_friend(request.user, to_user):
            return Response({"message": 'Friend deleted.'}, status.HTTP_201_CREATED)
        else:
            return Response({"message": 'Friend not found.'}, status.HTTP_400_BAD_REQUEST)


    @ action(detail=False,
             serializer_class=FriendshipRequestResponseSerializer,
             methods=['post'])
    def accept_request(self, request, id=None):
        """
        Принимает запрос на добавление в друзья
        Id запроса, указанный в URL-адресе, будет принят
        """
        id = request.data.get('id', None)
        friendship_request = get_object_or_404(
            FriendshipRequest, pk=id)

        if not friendship_request.to_user == request.user:
            return Response(
                {"message": "Request for current user not found."},
                status.HTTP_400_BAD_REQUEST
            )

        friendship_request.accept()
        return Response(
            {"message": "Request accepted, user added to friends."},
            status.HTTP_201_CREATED
        )

    @ action(detail=False,
             serializer_class=FriendshipRequestResponseSerializer,
             methods=['post'])
    def reject_request(self, request, id=None):
        """
        Отклоняет запрос на добавление в друзья
        Идентификатор запроса, указанный в URL-адресе, будет отклонен
        """
        id = request.data.get('id', None)
        friendship_request = get_object_or_404(
            FriendshipRequest, pk=id)
        if not friendship_request.to_user == request.user:
            return Response(
                {"message": "Request for current user not found."},
                status.HTTP_400_BAD_REQUEST
            )
        friendship_request.reject()
        return Response(
            {
                "message": "Request rejected, user NOT added to friends."
            },
            status.HTTP_201_CREATED
        )
    
    @ action(detail=False,
             serializer_class=FriendSearchSerializer,
             methods=['post'])
    def search_friends(self, request, id=None):
        """
        Ищет в базе пользователей по запросу (для дальнейшего добавления в друзья)
        Возвращает список из 10(max) подходящих записей
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message=serializer.validated_data.get('message')
        search_results = User.objects.filter(Q(email__icontains=message) | Q(username__icontains=message)).exclude(pk=request.user.pk)[:10]
        return Response(FriendSerializer(search_results, many=True).data)

