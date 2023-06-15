from rest_framework import serializers
from .models import User
from django.core import exceptions
import django.contrib.auth.password_validation as validators

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

    #валидация пароля:
    def validate(self, data):
         password = data.get('password')
         errors = dict() 
         try:
             validators.validate_password(password=password, user=User)
         except exceptions.ValidationError as e:
             errors['password'] = list(e.messages)
         if errors:
             raise serializers.ValidationError(errors)
         return super(RegistrationAuth, self).validate(data)

class LoginAuth(serializers.ModelSerializer):
    """ Сериализация данных от Входа
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
        fields = ('id', 'username', 'email', 'last_name', 'phone_number')


class RecoveryEmailSerializer(serializers.Serializer):
    """ Сериализация почты от востановления пароля
    """
    email = serializers.EmailField()

class RecoveryPasswordSerializer(serializers.Serializer):
    """ Сериализация нового пароля
    """
    password = serializers.CharField()

