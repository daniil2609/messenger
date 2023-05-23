from .views import *
from django.urls import path, include


urlpatterns = [
    path('room_list/', ListRoomView.as_view(), name='room_list'),
    path('search_room/', SearchChatRoomView.as_view(), name='search_room'),
    path('enter_room/', EnterChatRoomView.as_view(), name='enter_room'),
    path('delete_room/', DeleteChatRoomView.as_view(), name='delete_room'),
    path('create_room/', CreateChatRoomView.as_view(), name='create_room'),
    path('add_user/', AddUserInRoom.as_view(), name='add_user'),
    path('edit_name/', EditNameChat.as_view(), name='edit_name'),
    path('partipicant/', GetParticipantRoom.as_view(), name='partipicant'),


]
