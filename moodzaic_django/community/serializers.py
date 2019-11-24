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
            user, created = User.objects.get_or_create(username=user['username'],
                                                       email=user['email'],
                                                       first_name=user['first_name'],
                                                       last_name=user['last_name'],
                                                       password=user['password'])
            community.users.add(user)
        return community


    def update(self, community, validated_data):
        usersData = validated_data.pop('users')
        community.name = validated_data['name']

        users_list = []

        for user in usersData:
            user, created = User.objects.get_or_create(username=user['username'],
                                                       email=user['email'],
                                                       first_name=user['first_name'],
                                                       last_name=user['last_name'],
                                                       password=user['password'])
            users_list.append(user)

        community.users.set(users_list)
        community.save()

        return community