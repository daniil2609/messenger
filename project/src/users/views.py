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
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator as \
    token_generator
from src.chat.models import Room


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
    """ Вход пользователя
    """
    login_data = serializers.LoginAuth(data=request.data)
    email = None
    password = None
    if login_data.is_valid():
        email=login_data.validated_data['email']
        password=login_data.validated_data['password']
        user = User.objects.filter(email=email).first()
    if email is None or password is None:
        return Response({'detail': 'Please provide username and password.'}, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(email=email, password=password)
    if user is None:
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)
    if user.email_verify == False:
        return Response({'detail': 'Email not confirmed.'}, status=status.HTTP_400_BAD_REQUEST)
    login(request, user)
    return Response({'detail': 'Successfully logged in.'}, status=status.HTTP_200_OK)


@api_view(["POST"])
def logout_view(request):
    """ Выход пользователя
    """
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

        user = User.objects.get(pk=instance.id)
        old_username = user.username
        email = serializer.validated_data['email']
        new_username = serializer.validated_data['username']
        #если изменяется email высылаем подтверждение
        if user.email != email:
            user.email = email
            serializer.validated_data['email_verify'] = False
            send_email_verify.send_email_for_verify(request, user)
        #если изменяется имя переминовываем все display_name в личных чатах
        if user.username != new_username:
            ls_all = Room.objects.filter(type = 1, participant=self.request.user.pk)
            for ls in ls_all:
                ls.display_name = ls.display_name.replace(old_username, new_username)
                ls.save()

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
    """ Получить информацию о аунтетификации пользователя
    """
    if not request.user.is_authenticated:
        #return Response({'isAuthenticated: False'}, status=status.HTTP_200_OK)
    #return Response({'isAuthenticated: True'}, status=status.HTTP_200_OK)
        return Response({'detail': False}, status=status.HTTP_200_OK)
    return Response({'detail': True}, status=status.HTTP_200_OK)


@api_view(["POST"])
def user_recovery(request):
    """ Востановление учетной записи (проверка email)
    """
    data = serializers.RecoveryEmailSerializer(data=request.data)
    if data.is_valid():
        user = User.objects.filter(email=data.validated_data['email']).first()
        if user is None:
            return Response({'detail': 'User is not defined'}, status=status.HTTP_403_FORBIDDEN)
        else:
            send_email_verify.send_email_for_recovery(request, user)
            return Response({'detail': 'An email has been sent to you with further instructions'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'detail': 'Bad email'}, status=status.HTTP_403_FORBIDDEN)
    

@api_view(["POST"])
def new_password(request, uidb64, token):
    """ Востановление учетной записи (изменение пароля)
    """
    user = EmailVerify.get_user(uidb64)
    if user is not None and default_token_generator.check_token(user, token):
        data = serializers.RecoveryPasswordSerializer(data=request.data)
        if data.is_valid():
            new_password=data.validated_data['password']
            user.set_password(new_password)
            user.save()
            return Response({'detail': 'Successfully recovery password'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Bad password'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': 'Bad token or user'}, status=status.HTTP_400_BAD_REQUEST)


class PasswordRecoveryView(View):
    def get(self, request, uidb64, token):
        user = EmailVerify.get_user(uidb64)
        if user is not None and default_token_generator.check_token(user, token):
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token_out = token_generator.make_token(user)
            return redirect(settings.SUCCEFULLY_PASSWORD_RECOVERY_REDIRECT + '/' + uid + '/' + token_out + '/')
        return redirect(settings.ERROR_EMAIL_VERIFY_REDIRECT)
    
