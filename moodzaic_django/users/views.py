from users.models import User, Profile, Observation
from users.serializers import UserSerializer, ProfileSerializer, ObservationSerializer
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from mood_model.mood_tools import getEmotions

import logging

logger = logging.getLogger(__name__)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'

    def partial_update(self, request, username):
        print(request.data)
        serializer = UserSerializer(User.objects.get(username=username), data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        exists = User.objects.filter(username=request.data["username"]).first()
        if exists is not None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if (len(request.data["username"])<1):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        print(serializer)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'username'


    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        for k in request.data:
            if k == 'name':
                if (request.data[k]==''):
                    return Response(status=status.HTTP_400_BAD_REQUEST)
        # REMINDERS: my attempt at removing a user, with the function implemented by backend
        print(request.data)
        if "reminderList" in request.data:
            print(request.data["reminderList"])
            instance.removeReminder(request.data["reminderList"])
            del request.data["reminderList"]
        # end of attempt
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    # def partial_update(self, request, username):
    #     print('HERE')
    #     print(type(request.data))
    #     print(request.data)
    #     data = request.data


    #     serializer = ProfileSerializer(Profile.objects.get(username=username), data=request.data, partial=True)

    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     print(serializer.errors)
    #     return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)


class ObservationViewSet(viewsets.ModelViewSet):
    # queryset = Observation.objects.all()
    serializer_class = ObservationSerializer
    lookup_field = 'date'

    def get_queryset(self):

        user = Profile.objects.get(username=self.kwargs['username'])
        profileId = user.id
        print(user.id)

        # username = self.request.user.username
        return Observation.objects.filter(user=profileId)

    def create(self, request, *args, **kwargs):
        print(request.data)
        user = Profile.objects.get(username=self.kwargs['username'])
        profileId = user.id
        request.data['user'] = profileId
        serializer = self.get_serializer(data=request.data)
        print(serializer)
        if not serializer.is_valid():

            return Response(status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        # REMINDERS
        mood, days = user.MoodScoreCalc()
        user.updateReminders(user.MoodScore)
        if days >= 10:
            user.retrain()
        # end of attempt
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        print(self.kwargs['username'])
        print("print", serializer)
        #TODO: perform ML operation here
        # serializer.user = Profile.objects.get(username=self.kwargs['username'])
        serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        user = Profile.objects.get(username=self.kwargs['username'])

        mood, days = user.MoodScoreCalc()
        user.updateReminders(user.MoodScore)
        if days >= 10:
            user.retrain()

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

# @api_view(['POST'])
# def setObservation(request, username):
#     #need to serialize profile too?
#     emotions = getEmotions()
#     if not(request.data['mood'] in emotions):
#         return Response(status=status.HTTP_400_BAD_REQUEST)
#     request.data["mood"] = emotions.index(request.data["mood"])
#     print(request.data)
#     obsSerializer = ObservationSerializer(data=request.data)
#     if obsSerializer.is_valid():
#         profile = Profile.objects.get(username=username)
#         obsSerializer.save()

#         profile.MoodScoreCalc()
#         profile.updateReminders(profile.MoodScore)
#     logger.error(obsSerializer.errors)
#     return Response(obsSerializer.data)

# @api_view(['GET'])
# def getObservations(request, username):
#     #need to serialize profile too?


#     profile = Profile.objects.get(username=username)
#     observations = Observation.objects.filter(user__username=profile.username)
#     serializer = ObservationSerializer(observations, many=True)

#     # print(serializer.data)
#     # serializer.data["mood"] = emotions[int(serializer.data["mood"])]
#     return Response(serializer.data)

@api_view(['GET'])
def getAllObservations(request):
    #need to serialize profile too?
    observations = Observation.objects.all()
    serializer = ObservationSerializer(observations, many=True)

    # print(serializer.data)
    # serializer.data["mood"] = emotions[int(serializer.data["mood"])]
    return Response(serializer.data)

# @api_view(['GET'])
# def allUsers(request):
#     """
#     List all code snippets, or create a new snippet.
#     """

#     users = User.objects.all()
#     serializer = UserSerializer(users, many=True)
#     return Response(serializer.data)


# @api_view(['GET', 'PUT', 'DELETE'])
# def userDetails(request, username):
#     """
#  Retrieve, update or delete a customer by id/pk.
#  """
#     try:
#         user = User.objects.get(username=username)
#     except User.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = UserSerializer(user, context={'request': request})
#         return Response(serializer.data)

#     elif request.method == 'DELETE':
#         user.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

#     elif request.method == 'PUT':
#         serializer = UserSerializer(user, context={'request': request})

# # def updateUser(request, username):
# #     """
# #     Retrieve, update or delete a customer by id/pk.
# #     """
# #     return Response(status=status.HTTP_404_NOT_FOUND)

# @api_view(['POST'])
# def createUser(request):
#     """
#     Retrieve, update or delete a customer by id/pk.
#     """
#     return Response(status=status.HTTP_404_NOT_FOUND)

# @api_view(['GET', 'POST'])
# def allProfiles(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     if request.method == 'GET':
#         profiles = Profile.objects.all()
#         serializer = ProfileSerializer(profiles, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         # if (request.data['age'] < 0):
#         #     return Response(status=status.HTTP_404_NOT_FOUND)

#         serializer = ProfileSerializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'DELETE'])
# def profileDetails(request, username):
#     """
#  Retrieve, update or delete a customer by id/pk.
#  """
#     try:
#         profile = Profile.objects.get(username=username)
#     except Profile.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = ProfileSerializer(profile, context={'request': request})
#         return Response(serializer.data)

#     elif request.method == 'DELETE':
#         profile.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


# @api_view(['GET', 'POST'])
# def allUserObservations(request, username):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     # try:
#     #     observations = Observation.objects.filter(user__username=username)
#     # except Profile.DoesNotExist:
#     #     return Response(status=status.HTTP_404_NOT_FOUND)

#     # if request.method == 'GET':
#     #     serializer = ObservationSerializer(observations, many=True)
#     #     return Response(serializer.data)

#     # elif request.method == 'POST':
#     #     serializer = ObservationSerializer(data=request.data.observation)

#     #     if serializer.is_valid():
#     #         serializer.save()
#     #         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     return Response(status=status.HTTP_400_BAD_REQUEST)
