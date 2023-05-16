from django.contrib.auth import get_user_model
from rest_framework import serializers
from friendship.models import FriendshipRequest, Friend


class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'last_name', 'phone_number')


class FriendshipRequestSerializer(serializers.ModelSerializer):
    to_user = serializers.CharField()
    from_user = serializers.StringRelatedField()

    class Meta:
        model = FriendshipRequest
        fields = ('id', 'from_user', 'to_user', 'message',
                  'created', 'rejected', 'viewed')
        extra_kwargs = {
            'from_user': {'read_only': True},
            'created': {'read_only': True},
            'rejected': {'read_only': True},
            'viewed': {'read_only': True},
        }


class FriendshipRequestResponseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = FriendshipRequest
        fields = ('id',)


class FriendSearchRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length = 100)


class FriendSearchResponseSerializer(serializers.ModelSerializer):
    friendly_state = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'last_name', 'friendly_state', 'phone_number')

    def get_friendly_state(self, obj):
        user_my = self.context.get('user', None)
        to_user_my = obj

        if FriendshipRequest.objects.filter(to_user = to_user_my, from_user=user_my).first() is not None:
            return str('Have you already sent a friendship request')
        elif FriendshipRequest.objects.filter(to_user = user_my, from_user=to_user_my).first() is not None:
            return str('A user has sent you a friendship request')
        elif Friend.objects.are_friends(user_my, to_user_my):
            return str('The user is already your friend')
        else:
            return str('No friendships')


