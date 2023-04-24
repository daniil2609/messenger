from django.urls import path
from .endpoint import views
from django.views.generic import TemplateView

urlpatterns = [
    path('me/', views.UserView.as_view({'get': 'retrieve', 'put': 'update'})),
    path('register/', views.registration_auth),
    path('login/', views.login_auth),
    path('logout/', views.logout_auth),
]
