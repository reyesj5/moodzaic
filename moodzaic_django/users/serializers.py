from rest_framework import serializers
from users.models import User, Profile, Observation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email')
        extra_kwargs = {
            'username': {'validators': []},
            'url': {'lookup_field': 'username'}
        }


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)

    class Meta:
        model = Profile
        fields = ('username', 'age', 'gender', 'user',)
        extra_kwargs = {
            'url': {'lookup_field': 'username'}
        }

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        # u = UserSerializer.create(UserSerializer(), user_data)
        user = User.objects.create(username=user_data['username'],
                                    email=user_data['email'],
                                    first_name=user_data['first_name'],
                                    last_name=user_data['last_name'],
                                    password=user_data['password'])

        profile = Profile.objects.create(user=user, **validated_data)
        return profile

    def validate(self, data):
        p = Profile()
        if not p.setAge(data['age']):
            raise serializers.ValidationError("age error")
        return data

class ObservationSerializer(serializers.ModelSerializer):
    class Meta:
        user = serializers.RelatedField(many=True, read_only=True)#, slug_field='username')
        model = Observation
        fields = '__all__'
        extra_kwargs = {
            'url': {'lookup_field': 'username'}
        }
    def create(self, validated_data):
        moodData = validated_data.pop('mood')
        profileData = validated_data.pop('user')
        profile = Profile.objects.get_or_create(username=profileData['username'],
                                                age=profileData['age'],
                                                gender=profileData['gender'],
                                                user=profileData['user'])
        validated_data['profile'] = profile
        observation = Observation.objects.create(**validated_data)

