from django.urls import path
from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('register/', registration_auth),
    path('login/', login_view, name='api-login'),
    path('logout/', logout_view, name='api-logout'),
    path('me/', UserView.as_view({'get': 'retrieve', 'put': 'update'}), name='api-userview'),
    path('verify_email/<uidb64>/<token>/', EmailVerify.as_view(), name='verify_email'),
]
