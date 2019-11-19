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

@api_view(['GET'])
def allCommunities(request):
    communities = Community.objects.all()
    serializer = CommunitySerializer(communities, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def createCommunity(request):
    if request.method == 'POST':
        serializer = CommunitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.data)

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
    # elif request.method == 'PUT':
    #     try:
    #         # TODO