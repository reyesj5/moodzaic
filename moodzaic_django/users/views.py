from users.models import User, Profile, Observation
from users.serializers import UserSerializer, ProfileSerializer, ObservationSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics




@api_view(['GET'])
def allUsers(request):
    """
    List all code snippets, or create a new snippet.
    """
    
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET', 'DELETE'])
def userDetails(request, username):
    """
 Retrieve, update or delete a customer by id/pk.
 """
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

def updateUser(request, username):
    """
    Retrieve, update or delete a customer by id/pk.
    """
    return Response(status=status.HTTP_404_NOT_FOUND)

def createUser(request):
    """
    Retrieve, update or delete a customer by id/pk.
    """
    return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
def profile_list(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        profiles = Profile.objects.all()
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ProfileSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
def profile_detail(request, username):
    """
 Retrieve, update or delete a customer by id/pk.
 """
    try:
        profile = Profile.objects.get(username=username)
    except Profile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)
        
    elif request.method == 'DELETE':
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def allUserObservations(request, username):
    """
    List all code snippets, or create a new snippet.
    """
    # try:
    #     observations = Observation.objects.filter(user__username=username)
    # except Profile.DoesNotExist:
    #     return Response(status=status.HTTP_404_NOT_FOUND)

    # if request.method == 'GET':
    #     serializer = ObservationSerializer(observations, many=True)
    #     return Response(serializer.data)

    # elif request.method == 'POST':
    #     serializer = ObservationSerializer(data=request.data.observation)

    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_400_BAD_REQUEST)