from rest_framework import viewsets, parsers, permissions
from . import serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from . import send_email_verify
from rest_framework import status
from django.views import View
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import redirect
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.conf import settings
from django.http import JsonResponse


@api_view(["POST"])
def registration_auth(request):
    """ Регистрация пользователя
    """
    registration_data = serializers.RegistrationAuth(data=request.data)
    if registration_data.is_valid():
        user = User.objects.filter(email=registration_data.validated_data['email']).first()
        if user is None:
            user = User.objects.create_user(
                        username=registration_data.validated_data['username'],
                        email=registration_data.validated_data['email'],
                        password=registration_data.validated_data['password'])
            send_email_verify.send_email_for_verify(request, user)
            return Response({'detail': 'Regestration successfully, confirm email'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'User already exists'}, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response({'detail': 'Bad data regestration'}, status=status.HTTP_403_FORBIDDEN)
    
@api_view(["POST"])
def login_view(request):
    login_data = serializers.LoginAuth(data=request.data)
    if login_data.is_valid():
        email=login_data.validated_data['email']
        password=login_data.validated_data['password']
        user = User.objects.filter(email=email).first()
    if email is None or password is None:
        return Response({'detail': 'Please provide username and password.'}, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(email=email, password=password)
    if user is None:
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)
    login(request, user)
    return Response({'detail': 'Successfully logged in.'}, status=status.HTTP_200_OK)


@api_view(["POST"])
def logout_view(request):
    if not request.user.is_authenticated:
        return Response({'detail': 'You\'re not logged in.'}, status=status.HTTP_400_BAD_REQUEST)
    logout(request)
    return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)


class UserView(viewsets.ModelViewSet):
    """ Просмотр и редактирование данных пользователя
    """
    parser_classes = (parsers.MultiPartParser,)
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        last_email = User.objects.get(pk=instance.id)
        email = serializer.validated_data['email']
        if last_email.email != email:
            last_email.email = email
            serializer.validated_data['email_verify'] = False
            send_email_verify.send_email_for_verify(request, last_email)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        return Response(serializer.data)

    def get_queryset(self):
        return self.request.user

    def get_object(self):
        return self.get_queryset()
    

class EmailVerify(View):
    def get(self, request, uidb64, token):
        user = self.get_user(uidb64)

        if user is not None and default_token_generator.check_token(user, token):
            user.email_verify = True
            user.save()
            return redirect(settings.SUCCEFULLY_EMAIL_VERIFY_REDIRECT)
        return redirect(settings.ERROR_EMAIL_VERIFY_REDIRECT)

    @staticmethod
    def get_user(uidb64):
        try:
            # urlsafe_base64_decode() decodes to bytestring
            uid = urlsafe_base64_decode(uidb64).decode()
            user = get_user_model().objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError,
                get_user_model().DoesNotExist, ValidationError):
            user = None
        return user 

@api_view(["GET"])
def session_view(request):
    if not request.user.is_authenticated:
        return Response({'isAuthenticated: False'}, status=status.HTTP_200_OK)
    return Response({'isAuthenticated: True'}, status=status.HTTP_200_OK)