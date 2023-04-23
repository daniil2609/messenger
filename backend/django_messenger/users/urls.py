from django.urls import path
from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('user/', UserView.as_view()),
    path('logout/', LogoutView.as_view()),

    path('verify_email/<uidb64>/<token>/', EmailVerify.as_view(), name='verify_email'),
    path('successful_verify/', TemplateView.as_view(template_name='registration/successful_verify.html'), name='successful_verify'),
    path('invalid_verify/', TemplateView.as_view(template_name='registration/invalid_verify.html'), name='invalid_verify'),

]
