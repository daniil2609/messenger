from django.conf import settings
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import render


#dj channels:
#тестовый чат на http://127.0.0.1:8000/test/lobby/
def index(request):
    return render(request, 'test/index_dj_test_channels.html')

def room(request, room_name):
    return render(request, 'test/room_dj_test_channels.html', {
        'room_name': room_name
    })
