from rest_framework import serializers
from .models import User

class RegistrationAuth(serializers.ModelSerializer):
    """ Сериализация данных от Регистрации
    """
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField()
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

class LoginAuth(serializers.ModelSerializer):
    """ Сериализация данных от Регистрации
    """
    email = serializers.EmailField()
    password = serializers.CharField()
    class Meta:
        model = User
        fields = ('email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

class UserSerializer(serializers.ModelSerializer):
    #получение данных пользователя
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'last_name', 'phone_number', 'email_verify')


class TokenSerializer(serializers.Serializer):
    #получение токена
    token = serializers.CharField()

