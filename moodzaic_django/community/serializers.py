from rest_framework import serializers
from community.models import Community, Post
from users.serializers import UserSerializer

class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        users = UserSerializer(many=True)
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        community = CommunitySerializer()
        fields = '__all__'
