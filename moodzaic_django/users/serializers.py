from rest_framework import serializers
from users.models import User, Profile, Observation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email')

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ('username', 'age', 'gender', 'user')

# class ObservationSerializer(serializers.ModelSerializer):
#     user = serializers.RelatedField(many=True, read_only=True)

#     class Meta:

#         model = Observation
#         fields = ('date', 'sleep', 'exercise', 'meals', 'reminder_list')
