from django.urls import path
from django.views.generic import TemplateView
from .endpoint import views

urlpatterns = [
    path('', views.UserFriendsView.as_view(), name='home'),
    #path('chat/', HomeUser.as_view(), name='home_chat'),
    #path('profile_edit/', ProfileEditView.as_view(), name='profile_edit'),

    #dj channels:
    #path('test/', index, name='index'),
    #path('test/<str:room_name>/', room, name='room'),
]
