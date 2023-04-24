from django.urls import path
from .endpoint import auth_views, views
from django.views.generic import TemplateView

urlpatterns = [
    path('me/', views.UserView.as_view({'get': 'retrieve', 'put': 'update'})),
    path('register/', auth_views.registration_auth),
    path('login/', auth_views.login_auth),
    path('logout/', auth_views.logout_auth),
]
