from community.models import Community, Post, Comment
from users.models import User
from community.serializers import CommunitySerializer, PostSerializer, CommentSerializer

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

# Get a user's communities
@api_view(['GET'])
def usersCommunities(request, username):
    user = User.objects.get(username=username)
    communities = Community.objects.all()
    communities = communities.filter(users__id__exact=user.id)
    serializer = CommunitySerializer(communities, many=True)
    return Response(serializer.data)

# Create a new community
@api_view(['POST'])
def createCommunity(request):
    if request.method == 'POST':
        serializer = CommunitySerializer(data=request.data)
        serializer.is_valid()
        try:
            testCommunity = Community.objects.get(name=list(serializer.validated_data.values())[0])
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
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
        try:
            community = Community.objects.get(name=name)
            serializer = CommunitySerializer(community, data=request.data)
            serializer.is_valid()
            if serializer.is_valid():
                serializer.update(community, request.data)
                return Response(serializer.data)
            logger.error(serializer.errors)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Community.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def createPost(request):
    if request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        logger.error(serializer.errors)
        return Response(serializer.data)

@api_view(['POST'])
def createComment(request):
    if request.method == 'POST':
        print(request.data)
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        logger.error(serializer.errors)
        return Response(serializer.data)

@api_view(['GET'])
def postDetails(request, pk):
    """
    Retrieve a post by pk.
    """
    if request.method == 'GET':
        try:
            post = Post.objects.get(pk = pk)
            serializer = PostSerializer(post,context={'request': request})
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def postComments(request, pk):
    """
    Retrieve all comments with originalPostId = pk.
    """
    if request.method == 'GET':
        comments = Comment.objects.all()
        print(comments.first().originalPostId)
        print(comments.count(), pk)
        comments = comments.filter(originalPostId=pk)
        print(comments.count(), pk)
        serializer = CommentSerializer(comments, many=True)
        print(serializer.data)
        return Response(serializer.data)

# Return all posts
@api_view(['GET'])
def allPosts(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

# class PostListCreate(generics.ListCreateAPIView):
#     queryset = Post.objects.all()
#     serializer_class = PostSerializer
#     logger.error("PostListCreate complete")

# @api_view(['Get', 'POST', 'DELETE'])
# def postDetails(request, pk):
#     try:
#         post = Post.objects.get(pk=pk)
#         serializer = PostSerializer(post,context={'request': request})
#         return Response(serializer.data)
#     except Post.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)