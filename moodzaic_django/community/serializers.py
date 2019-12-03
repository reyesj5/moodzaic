from rest_framework import serializers
from community.models import Community, Post, Comment
from users.models import User
from users.serializers import UserSerializer

class CommunitySerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, required=False)
    class Meta:
        model = Community
        fields = ['name', 'users']
        extra_kwargs = {
            'name': {'validators': []}
        }

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

    def validate(self, data):
        value = data['name']
        if (value == '') or (len(value) > 30) or (" " in value) or value.isspace():
            raise serializers.ValidationError("Community name invalid")
        return data

class PostSerializer(serializers.ModelSerializer):
    poster = UserSerializer()
    community = CommunitySerializer()

    class Meta:
        model = Post
        fields = ['post', 'community', 'poster', 'id']
        extra_kwargs = {
            'name': {'validators': []}
        }


    def create(self, validated_data):
        userData = validated_data.pop('poster')
        user = User.objects.get_or_create(username=userData['username'],
                                                       email=userData['email'],
                                                       first_name=userData['first_name'],
                                                       last_name=userData['last_name'],
                                                       password=userData['password'])[0]
        validated_data['poster'] = user

        communityData = validated_data.pop('community')
        community = Community.objects.get_or_create(name=communityData['name'])[0]
        validated_data['community'] = community

        post = Post.objects.create(**validated_data)
        return post

class CommentSerializer(serializers.ModelSerializer):
    poster = UserSerializer()
    community = CommunitySerializer()
    originalPost = PostSerializer()
    class Meta:
        model = Comment
        fields = ['post', 'community', 'poster', 'originalPost', 'originalPostId']

    def to_internal_value(self, data):
        internal_value = super(CommentSerializer, self).to_internal_value(data)
        ogpostid = data["originalPost"]["id"]

        internal_value.update({
            "ogpostid": ogpostid
        })
        return internal_value

    def create(self, validated_data):
        print(validated_data)
        userData = validated_data.pop('poster')
        user = User.objects.get_or_create(username=userData['username'],
                                                       email=userData['email'],
                                                       first_name=userData['first_name'],
                                                       last_name=userData['last_name'],
                                                       password=userData['password'])[0]
        validated_data['poster'] = user
        communityData = validated_data.pop('community')
        community = Community.objects.get_or_create(name=communityData['name'])[0]
        validated_data['community'] = community

        originalPostData = validated_data.pop('originalPost')
        originalPost, created = Post.objects.get_or_create(id=validated_data['ogpostid'])

        validated_data['originalPost'] = originalPost
        validated_data['originalPostId'] = validated_data["ogpostid"]
        del validated_data["ogpostid"]
        comment = Comment.objects.create(**validated_data)
        return comment
