from django.contrib.auth import get_user_model
from rest_framework import serializers
from friendship.models import FriendshipRequest, Friend


class FriendshipRequestSerializer(serializers.ModelSerializer):
    to_user = serializers.CharField()
    from_user = serializers.StringRelatedField()

    class Meta:
        model = FriendshipRequest
        fields = ('id', 'from_user', 'to_user', 'message', 'created', 'rejected', 'viewed')


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


