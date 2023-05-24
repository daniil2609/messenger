from django.urls import path
from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('register/', registration_auth),
    path('login/', login_view, name='api-login'),
    path('logout/', logout_view, name='api-logout'),
    path('me/', UserView.as_view({'get': 'retrieve', 'put': 'update'}), name='api-userview'),
    path('session/', session_view, name='api-session'),
    path('verify_email/<uidb64>/<token>/', EmailVerify.as_view(), name='verify_email'),
    path('recovery_email/', user_recovery, name='user_recovery_send'),
    path('recovery_email/<uidb64>/<token>/', PasswordRecoveryView.as_view(), name='user_recovery'),
    path('new_password/<uidb64>/<token>/', new_password, name='new_password'),
]
