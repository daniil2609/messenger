from rest_framework import viewsets, parsers, permissions
from .. import serializers
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from ..models import User, BlackListToken
from ..services import creating_token
from .. import serializers
from rest_framework import authentication
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
            
            while True:
                token = creating_token.create_token(user.id)
                bad_token = BlackListToken.objects.filter(token=token['access_token']).first()
                if bad_token is None:
                    break

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
        
        while True:
            token = creating_token.create_token(user.id)
            bad_token = BlackListToken.objects.filter(token=token['access_token']).first()
            if bad_token is None:
                break

        return Response(token)
    else:
        raise AuthenticationFailed(code=403, detail='Bad data login')
    

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
    
    '''токен в теле
        logout_data = serializers.TokenSerializer(data=request.data)
    if logout_data.is_valid():
        BlackListToken.objects.create(token=logout_data.validated_data['token'])
        return Response({'detail': 'Logout successfully'}, status=status.HTTP_201_CREATED)
    else:
        Response(logout_data.errors, status=status.HTTP_400_BAD_REQUEST)
    '''


class UserView(viewsets.ModelViewSet):
    """ Просмотр и редактирование данных пользователя
    """
    parser_classes = (parsers.MultiPartParser,)
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user

    def get_object(self):
        return self.get_queryset()
    
