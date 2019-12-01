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

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if "reminderList" in request.data:
            instance.removeReminder(request.data["reminderList"])
            del request.data["reminderList"]
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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

        