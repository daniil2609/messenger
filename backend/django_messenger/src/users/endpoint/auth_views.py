from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from ..models import User, BlackListToken
from ..services import creating_token
from .. import serializers
from rest_framework import status


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
            token = creating_token.create_token(user.id)
            return Response(token)
        else:
            AuthenticationFailed(code=403, detail='User already exists')
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
        
        #if user.email_verify == False:
        #    raise AuthenticationFailed('User email was not confirmed')
        
        if not user.check_password(password):
            raise AuthenticationFailed(code=403, detail='Incorrect password!')
        
        token = creating_token.create_token(user.id)
        return Response(token)
    else:
        raise AuthenticationFailed(code=403, detail='Bad data login')
    

@api_view(["POST"])
def logout_auth(request):
    """ Выход пользователя
    """
    logout_data = serializers.TokenSerializer(data=request.data)
    if logout_data.is_valid():
        BlackListToken.objects.create(token=logout_data.validated_data['token'])
        return Response({'detail': 'Logout successfully'}, status=status.HTTP_201_CREATED)
    else:
        Response(logout_data.errors, status=status.HTTP_400_BAD_REQUEST)



