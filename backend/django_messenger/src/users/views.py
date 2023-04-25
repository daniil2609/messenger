from rest_framework import viewsets, parsers, permissions
from . import serializers
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from .models import User, BlackListToken
from .services import creating_token, send_email_verify
from . import serializers
from rest_framework import authentication
from rest_framework import status
from django.views import View
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator as \
    token_generator
from django.shortcuts import render, redirect
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, login, get_user_model
from django.conf import settings

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
            raise AuthenticationFailed(code=403, detail='User already exists')
    else:
        raise AuthenticationFailed(code=403, detail='Bad data regestration')
    
@api_view(["POST"])
def login_auth(request):
    """ Вход пользователя
    """
    login_data = serializers.LoginAuth(data=request.data)
    if login_data.is_valid():
        email=login_data.validated_data['email']
        password=login_data.validated_data['password']
        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')
        
        if user.email_verify == False:
            raise AuthenticationFailed('User email was not confirmed')
        
        if not user.check_password(password):
            raise AuthenticationFailed(code=403, detail='Incorrect password!')
        
        while True:
            token = creating_token.create_token(user.id)
            bad_token = BlackListToken.objects.filter(token=token['access_token']).first()
            if bad_token is None:
                break

        return Response(token)
    else:
        raise AuthenticationFailed(code=403, detail='Bad data login')


class EmailVerify(View):
    def get(self, request, uidb64, token):
        user = self.get_user(uidb64)

        if user is not None and token_generator.check_token(user, token):
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


@api_view(["POST"])
def logout_auth(request):
    """ Выход пользователя(токен в заголовке)
    """
    try:
        logout_data = authentication.get_authorization_header(request).split()
        token = logout_data[1].decode('UTF-8')
        BlackListToken.objects.create(token=token)
        return Response({'detail': 'Logout successfully'}, status=status.HTTP_201_CREATED)
    except:
        return Response({'detail': 'Logout error'}, status=status.HTTP_400_BAD_REQUEST)


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
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def get_queryset(self):
        return self.request.user

    def get_object(self):
        return self.get_queryset()
    
