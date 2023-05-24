from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name="index"),
    path('sign_up', views.index),
    path('sign_in', views.index),
    path('personalpage', views.index),
    path('personalpage/datauser', views.index),
    path('personalpage/my_friends', views.index),
    path('personalpage/search_friends', views.index),
    path('personalpage/chats', views.index),
    path('personalpage/history/outgoing', views.index),
    path('personalpage/history/putgoing', views.index),
    path('personalpage/history/rejected', views.index),

    path('recovery_email_verify', views.index),
    path('recovery_new_password/<uidb64>/<token>/', views.index),

]