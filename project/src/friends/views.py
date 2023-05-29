from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework.response import Response
from friendship.models import Friend, FriendshipRequest
from friendship.exceptions import AlreadyExistsError, AlreadyFriendsError
from .serializers import *
from src.users.serializers import UserSerializer
from django.db.models import Q
from src.users.models import User
from src.chat.models import Room
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination


User = get_user_model()


class ResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


class ListFriendView(ListAPIView):
    """ 
    Выводит список друзей
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    #pagination_class = ResultsSetPagination

    def get_queryset(self):
        return Friend.objects.friends(user=self.request.user)
    

class ListRequestsFriendView(ListAPIView):
    """ 
    просмотр входящих запросов в друзья
    """
    serializer_class = FriendshipRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    #pagination_class = ResultsSetPagination

    def get_queryset(self):
        return Friend.objects.unrejected_requests(user=self.request.user)
    

class ListSentRequestsFriendView(ListAPIView):
    """ 
    просмотр исходящих запросов в друзья
    """
    serializer_class = FriendshipRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    #pagination_class = ResultsSetPagination

    def get_queryset(self):
        return Friend.objects.sent_requests(user=self.request.user)
    

class ListRejectedRequestsFriendView(ListAPIView):
    """ 
    просмотр отклоненных ранее запросов в друзья
    """
    serializer_class = FriendshipRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    #pagination_class = ResultsSetPagination

    def get_queryset(self):
        return Friend.objects.rejected_requests(user=self.request.user)


class SearchFriendsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Ищет в базе пользователей по запросу (для дальнейшего добавления в друзья)
        Возвращает список из 20(max) подходящих записей
        """
        message=request.query_params['message']
        search_results = User.objects.filter(Q(email__icontains=message) | Q(username__icontains=message)).exclude(pk=request.user.pk)[:20]
        return Response(FriendSearchResponseSerializer(search_results, many=True, context={'user': request.user}).data)


class AddFriendsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Добавляет нового друга
        - to_user (email)
        - message
        """
        serializer = FriendshipRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        to_user = get_object_or_404(User, email=serializer.validated_data.get('to_user'))

        try:
            Friend.objects.add_friend(
                request.user,
                to_user,
                message=request.data.get('message', '')
            )
            return Response({'detail': 'Friends have been added'}, status.HTTP_201_CREATED)
        except (AlreadyExistsError, AlreadyFriendsError) as e:
            return Response({'detail': str(e)}, status.HTTP_400_BAD_REQUEST)
        

class DeleteFriendsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Удаляет дружеские отношения.
        Имя пользователя, указанное в данных POST, будет
        удалено из списка друзей текущего пользователя.
        
        - to_user (email)
        - message
        """
        serializer = FriendshipRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        to_user = get_object_or_404(User, email=serializer.validated_data.get('to_user'))

        if Friend.objects.remove_friend(request.user, to_user):
            #удаляем текущего пользователя из личного чата
            room = Room.objects.filter(Q(name='_'+str(request.user.pk)+'_'+str(to_user.pk)+'_'+str(to_user.pk)+'_'+str(request.user.pk)+'_') 
                                       | Q(name='_'+str(to_user.pk)+'_'+str(request.user.pk)+'_'+str(request.user.pk)+'_'+str(to_user.pk)+'_')).first()
            if room is not None:
                #если в комнате остался один участник удаляем комнату:
                if room.participant.count() == 1:
                    room.delete()
                else:
                    room.participant.remove(request.user)
                    room.save()
            return Response({"detail": 'Friend deleted.'}, status.HTTP_201_CREATED)
        else:
            return Response({"detail": 'Friend not found.'}, status.HTTP_400_BAD_REQUEST)


class AcceptFriendRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Принимает запрос на добавление в друзья
        Id запроса будет принят
        """
        id = request.data.get('id', None)
        friendship_request = get_object_or_404(FriendshipRequest, pk=id)

        if not friendship_request.to_user == request.user:
            return Response({"detail": "Request for current user not found."}, status.HTTP_400_BAD_REQUEST)
        #добавляем для друзей чат комнату
        to_user = get_object_or_404(User, email=friendship_request.to_user)
        user = get_object_or_404(User, email=friendship_request.from_user)
        #если комната уже существует (пользователь ранее ее удалил) то добавляем его обратно
        room = Room.objects.filter(Q(name='_'+str(user.pk)+'_'+str(to_user.pk)+'_'+str(to_user.pk)+'_'+str(user.pk)+'_') | Q(name='_'+str(to_user.pk)+'_'+str(user.pk)+'_'+str(user.pk)+'_'+str(to_user.pk)+'_')).first()
        if room is not None:
            room.participant.add(to_user)
            room.participant.add(user)
            room.save()
        #если не существует то создаем новую комнату
        else:
            room = Room.objects.create(
                name = '_'+str(user.pk)+'_'+str(to_user.pk)+'_'+str(to_user.pk)+'_'+str(user.pk)+'_',
                type = 1,
                display_name = str(user.username)+'_'+str(to_user.username)
            )
            room.participant.add(user)
            room.participant.add(to_user)
            room.save()
        friendship_request.accept()
        return Response({"detail": "Request accepted, user added to friends."}, status.HTTP_201_CREATED)


class RejectFriendRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Отклоняет запрос на добавление в друзья
        Идентификатор запроса, указанный в URL-адресе, будет отклонен
        """
        id = request.data.get('id', None)
        friendship_request = get_object_or_404(FriendshipRequest, pk=id)
        if not friendship_request.to_user == request.user:
            return Response({"detail": "Request for current user not found."}, status.HTTP_400_BAD_REQUEST)
        friendship_request.reject()
        return Response({"detail": "Request rejected, user NOT added to friends."}, status.HTTP_201_CREATED)

