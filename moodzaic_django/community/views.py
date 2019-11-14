from community.models import Community
from community.serializers import CommunitySerializer

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import logging

logger = logging.getLogger(__name__)



# class CommunityListCreate(generics.ListCreateAPIView):
#     queryset = Community.objects.all()
#     serializer_class = CommunitySerializer

@api_view(['POST'])
def makeCommunity(request):
    if request.method == 'POST':
        logger.error('Success!')
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST', 'DELETE'])
def communityDetails(request, name):
    """
    Retrieve, update or get a community by name.
    """
    try:
        community = Community.objects.get(name=name)
        serializer = CommunitySerializer(community,context={'request': request})
        return Response(serializer.data)
    except Community.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = CommunitySerializer(community,context={'request': request})
            return Response(serializer.data)

        # elif request.method == 'POST':
        #         serializer = CustomerSerializer(customer, data=request.data,context={'request': request})
        #         if serializer.is_valid():
        #             serializer.save()
        #             return Response(serializer.data)
        #             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        #
        # elif request.method == 'DELETE':
        #     community.delete()
        #     return Response(status=status.HTTP_204_NO_CONTENT)