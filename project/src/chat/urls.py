from .views import *
from django.urls import path, include



urlpatterns = [
    #path('me/friends/', UserFriendsView.as_view()),
    #path('chat/', HomeUser.as_view(), name='home_chat'),
    #path('profile_edit/', ProfileEditView.as_view(), name='profile_edit'),

    #dj channels:
    #path('test/', index, name='index'),
    #path('test/<str:room_name>/', room, name='room'),
    
    #dj channels:
    path('test/', index, name='index'),
    path('test/<str:room_name>/', room, name='room'),
]
