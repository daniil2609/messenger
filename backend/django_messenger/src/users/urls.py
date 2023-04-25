from django.urls import path
from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('me/', UserView.as_view({'get': 'retrieve', 'put': 'update'})),
    path('register/', registration_auth),
    path('login/', login_auth),
    path('logout/', logout_auth),

    path('verify_email/<uidb64>/<token>/', EmailVerify.as_view(), name='verify_email'),
]
