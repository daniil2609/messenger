from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name="index"),
    path('sign_up', views.index),
    path('sign_in', views.index),
    path('personalpage', views.index),
    path('personalpage/datauser', views.index),
    path('personalpage/friends', views.index),
    path('personalpage/chats', views.index)
]