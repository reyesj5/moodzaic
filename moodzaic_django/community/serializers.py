from rest_framework import serializers
from community.models import Community, Post
from users.models import User
from users.serializers import UserSerializer

class CommunitySerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, required=False)
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


class PostSerializer(serializers.ModelSerializer):
    poster = UserSerializer()
    community = CommunitySerializer()
    class Meta:
        model = Post
        fields = ['post', 'community', 'poster']

    def create(self, validated_data):
        print('MIBBY')
        userData = validated_data.pop('poster')
        user = User.objects.get_or_create(username=userData['username'],
                                                       email=userData['email'],
                                                       first_name=userData['first_name'],
                                                       last_name=userData['last_name'],
                                                       password=userData['password'])
        print(user)
        postData = validated_data.pop('post')

        communityData = validated_data.pop('community')
        print('swibby')
        community = Community.objects.get_or_create(name=communityData['name'])
        print(community)

        post = Post.objects.create(**validated_data)
        post.poster = user
        post.post = postData
        post.community = community
        return post

    def update(self, community, validated_data):
        userData = validated_data.pop('poster')
        user = User.objects.get_or_create(username=userData['username'],
                                                       email=userData['email'],
                                                       first_name=userData['first_name'],
                                                       last_name=userData['last_name'],
                                                       password=userData['password'])

        postData = validated_data.pop('post')

        communityData = validated_data.pop('community')
        community = Community.objects.get_or_create(name=communityData['name'],
                                                        users=communityData['users'])

        post = Post.objects.create(**validated_data)
        post.poster.set(user)
        post.post.set(postData)
        post.community.set(community)
        return post
