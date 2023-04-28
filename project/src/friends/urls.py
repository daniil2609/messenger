from django.urls import path
from django.views.generic import TemplateView
from .views import *
from django.urls import path, include
from rest_framework import routers


router = routers.DefaultRouter()
router.register('', FriendViewSet, 'friend')

urlpatterns = [
    path('', include(router.urls)),
]
