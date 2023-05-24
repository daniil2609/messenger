from django.shortcuts import render

def index(request, uidb64=None, token=None):
    return render(request, 'frontend/index.html')
