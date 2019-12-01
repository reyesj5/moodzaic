from rest_framework import serializers
from users.models import User, Profile, Observation
from mood_model.mood_tools import getEmotions

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email')
        extra_kwargs = {
            'username': {'validators': []},
            'url': {'lookup_field': 'username'},
        }


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True, validators=[])

    class Meta:
        model = Profile
        fields = ('username', 'age', 'gender', 'user',)
        extra_kwargs = {
            'url': {'lookup_field': 'username'}
        }

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        # u = UserSerializer.create(UserSerializer(), user_data)
        user, created = User.objects.get_or_create(username=user_data['username'],
                                    email=user_data['email'],
                                    first_name=user_data['first_name'],
                                    last_name=user_data['last_name'],
                                    password=user_data['password'])

        profile = Profile.objects.create(user=user, **validated_data)
        return profile

    # def update(self, instance, validated_data):
    #     print(instance)
    #     print(validated_data)
    #     user_data = validated_data.pop("user")
    #     instance.user.email = user_data.email
    #     instance.user.first_name = user_data.first_name
    #     instance.user.last_name = user_data.last_name
    #     instance.user.password = user_data.password
    #     instance.age = validated_data.age
    #     instance.gender = validated_data.gender
    #     instance.user.save()
    #     instance.save()
    #     return instance

    # def validate(self, data):
    #     p = Profile()
    #     if not p.setAge(data['age']):
    #         raise serializers.ValidationError("age error")
    #     return data

class ObservationSerializer(serializers.ModelSerializer):

    class Meta:
        user = serializers.RelatedField(many=True, read_only=True)#, slug_field='username')
        model = Observation
        fields = '__all__'
        extra_kwargs = {
            'url': {'lookup_field': 'username'}
        }

        