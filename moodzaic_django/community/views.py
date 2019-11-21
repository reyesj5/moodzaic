from community.models import Community
from users.models import User
from community.serializers import CommunitySerializer

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
import logging

logger = logging.getLogger(__name__)

# Return all communities
@api_view(['GET'])
def allCommunities(request):
    communities = Community.objects.all()
    serializer = CommunitySerializer(communities, many=True)
    return Response(serializer.data)

# Create a new community
@api_view(['POST'])
def createCommunity(request):
    if request.method == 'POST':
        serializer = CommunitySerializer(data=request.data)
        serializer.is_valid()
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

# Get a single community, or update a single community
# Pass its name to ensure this
@api_view(['GET', 'PUT'])
def communityDetails(request, name):
    """
    Retrieve, update or get a community by name.
    """
    if request.method == 'GET':
        try:
            community = Community.objects.get(name=name)
            serializer = CommunitySerializer(community,context={'request': request})
            return Response(serializer.data)
        except Community.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'PUT':
        community = Community.objects.get(name=name)

        serializer = CommunitySerializer(community, data=request.data)
        print(request.data)
        serializer.is_valid()
        logger.error(serializer.errors)
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.data)
