from rest_framework import serializers
from community.models import Community
from users.models import User
from users.serializers import UserSerializer

class CommunitySerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)
    class Meta:
        model = Community
        fields = ['name', 'users']

    def create(self, validated_data):
        usersData = validated_data.pop('users')
        community = Community.objects.create(**validated_data)
        for user in usersData:
            user, created = User.objects.get_or_create(username=user['username'])
            community.users.add(user)
        return community

    # def update(self, validated_data):
    #     usersData = validated_data.pop('users')
    #     community = Community.objects.create(**validated_data)
    #     for user in usersData:
    #         User.objects.create(**user)
    #     return community

