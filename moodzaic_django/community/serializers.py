from rest_framework import serializers
from community.models import Community
from users.serializers import UserSerializer

class CommunitySerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Community
        fields = ['name', 'users']