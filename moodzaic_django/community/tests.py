from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from community.views import *
from community.models import Community, Post, Comment
from users.models import User

import json

# Create your tests here.

# Testing our communities implementation and behaviour
class CommunityTestCase(TestCase):

    def setUp(self):
        ##create objects to be used for testing later
        Community.objects.create(name = "fitness")
        Community.objects.create(name = "sleep")
        User.objects.create(username = "emil")
        User.objects.create(username = "jersey")

    def test_getName(self):
        ##check getName & that communities are made correctly
        fitnessCommunity = Community.objects.get(name = "fitness")
        self.assertEqual("fitness", fitnessCommunity.getName())

    def test_setName(self):
        ##check that communities are made correctly
        fitnessCommunity = Community.objects.get(name = "fitness")
        self.assertEqual("fitness", fitnessCommunity.getName())
        ##check that names can be set/changed
        fitnessCommunity.setName("fitnessCommunity")
        self.assertEqual("fitnessCommunity", fitnessCommunity.getName())

        ##check edge cases for length of input
        ##check that the name remains set to the previous value if setting fails
        fitnessCommunity.setName("") ##length==0
        self.assertEqual("fitnessCommunity", fitnessCommunity.getName())
        fitnessCommunity.setName("r") ##length==1
        self.assertEqual("r", fitnessCommunity.getName())
        fitnessCommunity.setName("cwyZva1ZPOBu2UchlBAU0rXpQOr7X") ##length==29
        self.assertEqual("cwyZva1ZPOBu2UchlBAU0rXpQOr7X", fitnessCommunity.getName())
        fitnessCommunity.setName("cwyZva1ZPOBu2UchlBAU0rXpQOr7X0") #length==30
        self.assertEqual("cwyZva1ZPOBu2UchlBAU0rXpQOr7X0", fitnessCommunity.getName())
        fitnessCommunity.setName("cwyZva1ZPOBu2UchlBAU0rXpQOr7X00") #length==31
        self.assertNotEqual("cwyZva1ZPOBu2UchlBAU0rXpQOr7X00", fitnessCommunity.getName())

        ##check whitespace
        fitnessCommunity.setName("hello world")
        self.assertNotEqual("hello world", fitnessCommunity.getName())
        fitnessCommunity.setName("  ")
        self.assertNotEqual("  ", fitnessCommunity.getName())

        ##check other cases - all numeric, 'NULL', all symbols, partially symbols
        fitnessCommunity.setName("123")
        self.assertEqual("123", fitnessCommunity.getName())
        fitnessCommunity.setName("NULL")
        self.assertEqual("NULL", fitnessCommunity.getName())
        fitnessCommunity.setName("#$")
        self.assertEqual("#$", fitnessCommunity.getName())
        fitnessCommunity.setName("ideal_community")
        self.assertEqual("ideal_community", fitnessCommunity.getName()
        )

    def test_getUsers(self):
        fitnessCommunity = Community.objects.get(name = "fitness")
        fitnessUser = User.objects.get(username = "emil")
        fitnessUser2 = User.objects.get(username = "jersey")

        ##check that Communities are created empty
        self.assertEqual(0, fitnessCommunity.getUsers().count())

        ##test that getUsers returns list of Users in a Community
        fitnessCommunity.users.add(fitnessUser)
        qs = fitnessCommunity.getUsers()
        self.assertEqual(1, qs.count())
        self.assertEqual(fitnessUser, qs[0])

        ##test getUsers when there is more than one User in the Community
        fitnessCommunity.users.add(fitnessUser2)
        self.assertEqual(2, fitnessCommunity.getUsers().count())

    def test_addUserToCommunity(self):
        fitnessUser = User.objects.get(username = "emil")
        fitnessCommunity = Community.objects.get(name = "fitness")

        ##test adding a User to a Community
        fitnessCommunity.addUserToCommunity(fitnessUser)
        self.assertIn(fitnessUser, fitnessCommunity.getUsers())

        ##test adding the same User to a Community they're already in
        fitnessCommunity.addUserToCommunity(fitnessUser)
        self.assertEqual(1, fitnessCommunity.getUsers().count())
        self.assertIn(fitnessUser, fitnessCommunity.getUsers())

    def test_removeUserFromCommunity(self):
        fitnessUser = User.objects.get(username = "emil")
        fitnessUser2 = User.objects.get(username = "jersey")
        fitnessCommunity = Community.objects.get(name = "fitness")

        ##add User to Community
        fitnessCommunity.addUserToCommunity(fitnessUser)
        self.assertIn(fitnessUser, fitnessCommunity.getUsers())

        ##test removing a User not in a Community
        fitnessCommunity.removeUserFromCommunity(fitnessUser2);
        self.assertNotIn(fitnessUser2, fitnessCommunity.getUsers())

        ##test removing a User from a Community successfully
        fitnessCommunity.removeUserFromCommunity(fitnessUser)
        self.assertNotIn(fitnessUser, fitnessCommunity.getUsers())

        ##test removing a User from a Community multiple times
        num = fitnessCommunity.getUsers().count()
        fitnessCommunity.removeUserFromCommunity(fitnessUser)
        self.assertNotIn(fitnessUser, fitnessCommunity.getUsers())
        self.assertEqual(num, fitnessCommunity.getUsers().count())

# All tests in this class are testing our API handling functions.
# We test if GET, PUT, & POST requests successfully complete what they need to do.
# Testing these allow us to ensure that functions called from the frontend will work as intended
class ViewsPostTests(APITestCase):
    def setUp(self):
        client = APIClient()
        self.user1 =  {"username": "emil", "password": "snibby", "first_name": "name", "last_name": "lastname", "email": "email@email.ema"}
        user1Made = User.objects.create(**self.user1)
        self.community1 = {'name': 'fitness'}
        community1Made = Community.objects.create(**self.community1)
        community1Made.users.set([user1Made])
        self.compareCommunity1 = self.community1
        self.compareCommunity1['users'] = [self.user1]

        self.post1 = {'post': 'Hey everyone, lmaooo XD!!', 'community': self.community1, 'poster': self.user1}
        self.postWithId = {'post': 'Hey everyone, lmaooo XD!!', 'community': self.community1, 'poster': self.user1, 'id': 1}
        self.comment1 = {'post': 'OH SNAR', 'community': self.community1, 'poster': self.user1, 'originalPost': self.postWithId,
                            'originalPostId': 1}
        self.comment2 = {'post': 'OH Snibby', 'community': self.community1, 'poster': self.user1, 'originalPost': self.postWithId,
                            'originalPostId': 1}
    def test_getPost(self):
        url = '/api/create/post'
        data = self.post1
        self.assertEqual(Post.objects.count(), 0)
        response = self.client.post(url, data, format='json')
        newPostId = Post.objects.get().id

        response = self.client.get('/api/post/' + str(newPostId), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content), self.postWithId)

    def test_createPost(self):
        url = '/api/create/post'
        data = self.post1
        self.assertEqual(Post.objects.count(), 0)
        response = self.client.post(url, data, format='json')
        self.assertEqual(Post.objects.count(), 1)
        freshPost = Post.objects.get()
        self.assertEqual(freshPost.post, 'Hey everyone, lmaooo XD!!')
        self.assertEqual(freshPost.community.name, 'fitness')
        self.assertEqual(freshPost.poster.username, 'emil')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_createComment(self):
        url = '/api/create/post'
        data = self.post1        
        self.assertEqual(Post.objects.count(), 0)
        response = self.client.post(url, data, format='json')

        url = '/api/create/comment'
        data = self.comment1
        response = self.client.post(url, data, format='json')

        freshComment = Comment.objects.get()
        self.assertEqual(Comment.objects.count(), 1)
        self.assertEqual(freshComment.post, 'OH SNAR')

    def test_getAllComments(self):
        url = '/api/create/post'
        data = self.post1
        self.assertEqual(Post.objects.count(), 0)
        response = self.client.post(url, data, format='json')
        newPostId = Post.objects.get().id

        url = '/api/create/comment'
        data = self.comment1
        response = self.client.post(url, data, format='json')

        url = '/api/create/comment'
        data = self.comment2
        response = self.client.post(url, data, format='json')


        response = self.client.get('/api/post/comments/' + str(newPostId), format='json')
        self.assertEqual(json.loads(response.content), [self.comment1, self.comment2])

    def test_getOriginPost(self):
        url = '/api/create/post'
        data = self.post1        
        self.assertEqual(Post.objects.count(), 0)
        response = self.client.post(url, data, format='json')

        url = '/api/create/comment'
        data = self.comment1
        response = self.client.post(url, data, format='json')
        freshComment = Comment.objects.get()
        serialized = PostSerializer(Post.objects.get(id=freshComment.originalPostId))
        self.assertEqual(self.postWithId, serialized.data)

class ViewsCommunityTests(APITestCase):

    client = APIClient()
    user1 =  {"username": "emil", "password": "snibby", "first_name": "name", "last_name": "lastname", "email": "email@email.ema"}
    user2 = {"username": "marco", "password": "dogdog", "first_name": "name", "last_name": "lastname", "email": "dog@email.ema"}

    def test_usersCommunities(self):
        fitnessCommunity = Community.objects.create(name = "fitness")
        lazyCommunity = Community.objects.create(name = "lazy")
        emil = User.objects.create(username = "emil", password = "emil_pw")
        jersey = User.objects.create(username = 'jersey', password='jersey_pw')

        response = self.client.get('/api/emil/communities', format='json')
        self.assertEqual(json.loads(response.content), [])

        fitnessCommunity.addUserToCommunity(emil)
        response = self.client.get('/api/emil/communities', format='json')
        self.assertEqual(json.loads(response.content), [{'name': 'fitness', 'users': [{'email': '','first_name': '','last_name': '','password': 'emil_pw','username': 'emil'}]}])

        lazyCommunity.addUserToCommunity(emil)
        lazyCommunity.addUserToCommunity(jersey)
        response = self.client.get('/api/emil/communities', format='json')
        self.assertEqual(json.loads(response.content), [{'name': 'fitness',
    'users': [{'email': '',
               'first_name': '',
               'last_name': '',
               'password': 'emil_pw',
               'username': 'emil'}]},
   {'name': 'lazy',
    'users': [{'email': '',
               'first_name': '',
               'last_name': '',
               'password': 'emil_pw',
               'username': 'emil'},
              {'email': '',
               'first_name': '',
               'last_name': '',
               'password': 'jersey_pw',
               'username': 'jersey'}]}]
)


    # Tests getting all communities.
    # This function allows us to get every community
    def test_allCommunities(self):

        # There should be no communities returned
        response = self.client.get('/api/all/community', format='json')
        self.assertEqual(json.loads(response.content), [])

        # There should only be one community returned
        Community.objects.create(name = "fitness")
        response = self.client.get('/api/all/community', format='json')
        self.assertEqual(json.loads(response.content), [{'name': 'fitness', 'users': []}])

        # There should be two communities returned
        Community.objects.create(name = "sleep")
        response = self.client.get('/api/all/community', format='json')
        self.assertEqual(json.loads(response.content), [{'name': 'fitness', 'users': []}, {'name': 'sleep', 'users': []}])

    # Gets the communities that a user belongs to.
    def test_userCommunities(self):
        data = {'id': '0','name': 'fitness', 'users': [self.user1]}
        data2 = {'id': '1','name': 'cooking', 'users': [self.user1]}

        response = self.client.post('/api/create/community', data, format='json')
        response = self.client.post('/api/create/community', data2, format='json')

    # Tests creating a community
    # This function allows us to create a community
    def test_createCommunity(self):
        url = '/api/create/community'

        # This should successfully create a community

        data = {'id': '0','name': 'fitness', 'users': [self.user1]}
        data2 = {'id': '1','name': 'newFitness', 'users': [self.user1]}
        data3 = {'id': '2', 'name': 'cooking', 'users': [self.user1]}
        data4 = {'id': '3','name': 'fitness', 'users': []}

        response = self.client.post(url, data, format='json')
        response2 = self.client.post(url, data2, format='json')
        response3 = self.client.post(url, data3, format='json')

        self.assertEqual(Community.objects.count(), 3)
        #self.assertEqual(Community.objects.get().name, 'fitness')

        self.assertEqual(User.objects.count(), 1)

        # This should fail if you try and create a community with the same name
        response4 = self.client.post(url, data4, format='json')
        self.assertEqual(response4.status_code, status.HTTP_400_BAD_REQUEST)

        # This should fail if you pass in no data
        response5 = self.client.post(url, {}, format='json')
        self.assertEqual(response5.status_code, status.HTTP_400_BAD_REQUEST)


        # There should still only be three communities
        self.assertEqual(Community.objects.count(), 3)

    # This function should return an individual community
    def test_communityDetailsGET(self):
        url = '/api/community/'
        data = {'id': '0','name': 'fitness', 'users': [self.user1]}
        response = self.client.post('/api/create/community', data, format='json')

        # We should get the details of the community
        response = self.client.get(url + 'fitness', data, format='json')
        self.assertEqual(json.loads(response.content), {'name': 'fitness', 'users': [self.user1]})

        # We should not get anything if a community doesn't exist
        response = self.client.get(url + 'hi', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_communityDetailsPUT(self):
        url = '/api/community/'
        data = {'id': '0','name': 'fitness', 'users': []}
        response = self.client.post('/api/create/community', data, format='json')

        # We change the name of a community
        data = {'id': '0','name': 'newFitness', 'users': []}
        response = self.client.put(url + 'fitness', data, format='json')

        # There should still only be one community, and it should be named newFitness
        self.assertEqual(Community.objects.count(), 1)
        self.assertEqual(Community.objects.get().name, 'newFitness')
        self.assertEqual(Community.objects.get().users.count(), 0)

        # We add a user to the community
        data = {'id': '0','name': 'newFitness', 'users': [self.user1]}
        response = self.client.put(url + 'newFitness', data, format='json')

        # It should be named newFitness, and should now have a user
        self.assertEqual(Community.objects.count(), 1)
        self.assertEqual(Community.objects.get().name, 'newFitness')
        self.assertEqual(Community.objects.get().users.count(), 1)

        # We should return not found if the community doesn't exist
        response = self.client.put(url + 'hi', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class PostTestCase(TestCase):

    def setUp(self):
        Community.objects.create(name = "fitness")
        Community.objects.create(name = "sleep")
        User.objects.create(username = "emil")
        User.objects.create(username = "jersey")
        fitnessCommunity = Community.objects.get(name = "fitness")
        fitnessUser = User.objects.get(username = "emil")
        Post.objects.create(post = "Hello world", community = fitnessCommunity, poster = fitnessUser)

        # also tests getPost
    def test_setPost(self):
        firstPost = Post.objects.get(post = "Hello world")

        ##test valid string content of post
        firstPost.setPost("Hi!")
        self.assertEqual("Hi!", firstPost.getPost())

        firstPost.setPost("#%()")
        self.assertEqual("#%()", firstPost.getPost())

        firstPost.setPost("   ")
        self.assertEqual("   ", firstPost.getPost())

        ##tests empty string case
        ##checks that post remains set to previous string if setPost fails
        firstPost.setPost("Hi!")
        firstPost.setPost("")
        self.assertEqual("Hi!", firstPost.getPost())

        ##tests edge cases in length of post
        firstPost.setPost("6yWcC4W8mj5EGL686wYKTtDkIGrX0CAgS92ll9R47MgkKbSI66rWnk7y490hXP7wK8Y1bmdkAJrmtYVJ52IcMynYYz5YBwFSptiugcUclJlCxUkeGiS1ZnKP3o7jKwtkCf33rhwv8V3wJYQVLTg8KpOgjmQQHpRfGlv2zJGcukayda2CN9jQzo2nlQpfWzNVgvsNmgBZzskAYjmd2gxASfBHCGeOXzR2ui652z7HIRIrYrm2LEOwm9evex7sN1TazauvRTKKCa2av5AGeQsXCIqy1QXtQbClxkvFNY1yqPe205QkrdGwS8YavAqfMdIjje7mSlxklntVkQAJeKL9XuctwhFidQewwdpZ1q0PEBpUcF2U7xzJOYqIcMJoUqf2FFc5qOYK9DtVaqj1JurCFA4YLFn1gudz3yT0NZ1ONGa5qhPSDQ33fKNZhczlkEnAgtaCPHDLaYZ7c7I6Hp3RX3OyCJRWudmywYvQqSZtC1ZHH7j6jYcGyG0ApGJiKuRPVjGUhqSlqeuRAiOSUOQ4qtJrVFN3wBVT0nXv72Ddr1KsUTNTa5c2946lcKxQat9mjBwt2FrHNkXSPHymzOWBm8eMoX6DlmBLK3N0XILiSO3eUTBeKDE0Iuxh7Q27msI7iLGtDTnLddbPGcIRcETTnApLMDtCVrXxZQxoHuuVw6j3cAtj8NI73r4uxy6VGK3LevvLgJQM8nqcoF7Hn0lGoZHjQjTgeHJxLwDl4esfS4GnYRFRIQlIYUPKYznKD4SGPnlSzME7H4TCuhVqabjn5SBwW3N9CqGF4O1iaVzfhs77rVi4DbAVqvuKSscwUpIR60U5b3HoPEx4SOdhw8YBswAwHaqoh5aE0uaihlEF5xJAQM4mgqs8myDtCMd1WGbYiZMjd7zUgyUIXWnLMXch7yP6c0DcdhPn5hxt0FtcGp0sU7hxNgIN4ePVWsGIi9b74kVXhcDOCO83YmqG3eMtUm9jKmKDWQyhYhswCms") #999 chars
        self.assertEqual("6yWcC4W8mj5EGL686wYKTtDkIGrX0CAgS92ll9R47MgkKbSI66rWnk7y490hXP7wK8Y1bmdkAJrmtYVJ52IcMynYYz5YBwFSptiugcUclJlCxUkeGiS1ZnKP3o7jKwtkCf33rhwv8V3wJYQVLTg8KpOgjmQQHpRfGlv2zJGcukayda2CN9jQzo2nlQpfWzNVgvsNmgBZzskAYjmd2gxASfBHCGeOXzR2ui652z7HIRIrYrm2LEOwm9evex7sN1TazauvRTKKCa2av5AGeQsXCIqy1QXtQbClxkvFNY1yqPe205QkrdGwS8YavAqfMdIjje7mSlxklntVkQAJeKL9XuctwhFidQewwdpZ1q0PEBpUcF2U7xzJOYqIcMJoUqf2FFc5qOYK9DtVaqj1JurCFA4YLFn1gudz3yT0NZ1ONGa5qhPSDQ33fKNZhczlkEnAgtaCPHDLaYZ7c7I6Hp3RX3OyCJRWudmywYvQqSZtC1ZHH7j6jYcGyG0ApGJiKuRPVjGUhqSlqeuRAiOSUOQ4qtJrVFN3wBVT0nXv72Ddr1KsUTNTa5c2946lcKxQat9mjBwt2FrHNkXSPHymzOWBm8eMoX6DlmBLK3N0XILiSO3eUTBeKDE0Iuxh7Q27msI7iLGtDTnLddbPGcIRcETTnApLMDtCVrXxZQxoHuuVw6j3cAtj8NI73r4uxy6VGK3LevvLgJQM8nqcoF7Hn0lGoZHjQjTgeHJxLwDl4esfS4GnYRFRIQlIYUPKYznKD4SGPnlSzME7H4TCuhVqabjn5SBwW3N9CqGF4O1iaVzfhs77rVi4DbAVqvuKSscwUpIR60U5b3HoPEx4SOdhw8YBswAwHaqoh5aE0uaihlEF5xJAQM4mgqs8myDtCMd1WGbYiZMjd7zUgyUIXWnLMXch7yP6c0DcdhPn5hxt0FtcGp0sU7hxNgIN4ePVWsGIi9b74kVXhcDOCO83YmqG3eMtUm9jKmKDWQyhYhswCms", firstPost.getPost())

        firstPost.setPost("6yWcC4W8mj5EGL686wYKTtDkIGrX0CAgS92ll9R47MgkKbSI66rWnk7y490hXP7wK8Y1bmdkAJrmtYVJ52IcMynYYz5YBwFSptiugcUclJlCxUkeGiS1ZnKP3o7jKwtkCf33rhwv8V3wJYQVLTg8KpOgjmQQHpRfGlv2zJGcukayda2CN9jQzo2nlQpfWzNVgvsNmgBZzskAYjmd2gxASfBHCGeOXzR2ui652z7HIRIrYrm2LEOwm9evex7sN1TazauvRTKKCa2av5AGeQsXCIqy1QXtQbClxkvFNY1yqPe205QkrdGwS8YavAqfMdIjje7mSlxklntVkQAJeKL9XuctwhFidQewwdpZ1q0PEBpUcF2U7xzJOYqIcMJoUqf2FFc5qOYK9DtVaqj1JurCFA4YLFn1gudz3yT0NZ1ONGa5qhPSDQ33fKNZhczlkEnAgtaCPHDLaYZ7c7I6Hp3RX3OyCJRWudmywYvQqSZtC1ZHH7j6jYcGyG0ApGJiKuRPVjGUhqSlqeuRAiOSUOQ4qtJrVFN3wBVT0nXv72Ddr1KsUTNTa5c2946lcKxQat9mjBwt2FrHNkXSPHymzOWBm8eMoX6DlmBLK3N0XILiSO3eUTBeKDE0Iuxh7Q27msI7iLGtDTnLddbPGcIRcETTnApLMDtCVrXxZQxoHuuVw6j3cAtj8NI73r4uxy6VGK3LevvLgJQM8nqcoF7Hn0lGoZHjQjTgeHJxLwDl4esfS4GnYRFRIQlIYUPKYznKD4SGPnlSzME7H4TCuhVqabjn5SBwW3N9CqGF4O1iaVzfhs77rVi4DbAVqvuKSscwUpIR60U5b3HoPEx4SOdhw8YBswAwHaqoh5aE0uaihlEF5xJAQM4mgqs8myDtCMd1WGbYiZMjd7zUgyUIXWnLMXch7yP6c0DcdhPn5hxt0FtcGp0sU7hxNgIN4ePVWsGIi9b74kVXhcDOCO83YmqG3eMtUm9jKmKDWQyhYhswCms1") #1000 chars
        self.assertEqual("6yWcC4W8mj5EGL686wYKTtDkIGrX0CAgS92ll9R47MgkKbSI66rWnk7y490hXP7wK8Y1bmdkAJrmtYVJ52IcMynYYz5YBwFSptiugcUclJlCxUkeGiS1ZnKP3o7jKwtkCf33rhwv8V3wJYQVLTg8KpOgjmQQHpRfGlv2zJGcukayda2CN9jQzo2nlQpfWzNVgvsNmgBZzskAYjmd2gxASfBHCGeOXzR2ui652z7HIRIrYrm2LEOwm9evex7sN1TazauvRTKKCa2av5AGeQsXCIqy1QXtQbClxkvFNY1yqPe205QkrdGwS8YavAqfMdIjje7mSlxklntVkQAJeKL9XuctwhFidQewwdpZ1q0PEBpUcF2U7xzJOYqIcMJoUqf2FFc5qOYK9DtVaqj1JurCFA4YLFn1gudz3yT0NZ1ONGa5qhPSDQ33fKNZhczlkEnAgtaCPHDLaYZ7c7I6Hp3RX3OyCJRWudmywYvQqSZtC1ZHH7j6jYcGyG0ApGJiKuRPVjGUhqSlqeuRAiOSUOQ4qtJrVFN3wBVT0nXv72Ddr1KsUTNTa5c2946lcKxQat9mjBwt2FrHNkXSPHymzOWBm8eMoX6DlmBLK3N0XILiSO3eUTBeKDE0Iuxh7Q27msI7iLGtDTnLddbPGcIRcETTnApLMDtCVrXxZQxoHuuVw6j3cAtj8NI73r4uxy6VGK3LevvLgJQM8nqcoF7Hn0lGoZHjQjTgeHJxLwDl4esfS4GnYRFRIQlIYUPKYznKD4SGPnlSzME7H4TCuhVqabjn5SBwW3N9CqGF4O1iaVzfhs77rVi4DbAVqvuKSscwUpIR60U5b3HoPEx4SOdhw8YBswAwHaqoh5aE0uaihlEF5xJAQM4mgqs8myDtCMd1WGbYiZMjd7zUgyUIXWnLMXch7yP6c0DcdhPn5hxt0FtcGp0sU7hxNgIN4ePVWsGIi9b74kVXhcDOCO83YmqG3eMtUm9jKmKDWQyhYhswCms1", firstPost.getPost())

        firstPost.setPost("6yWcC4W8mj5EGL686wYKTtDkIGrX0CAgS92ll9R47MgkKbSI66rWnk7y490hXP7wK8Y1bmdkAJrmtYVJ52IcMynYYz5YBwFSptiugcUclJlCxUkeGiS1ZnKP3o7jKwtkCf33rhwv8V3wJYQVLTg8KpOgjmQQHpRfGlv2zJGcukayda2CN9jQzo2nlQpfWzNVgvsNmgBZzskAYjmd2gxASfBHCGeOXzR2ui652z7HIRIrYrm2LEOwm9evex7sN1TazauvRTKKCa2av5AGeQsXCIqy1QXtQbClxkvFNY1yqPe205QkrdGwS8YavAqfMdIjje7mSlxklntVkQAJeKL9XuctwhFidQewwdpZ1q0PEBpUcF2U7xzJOYqIcMJoUqf2FFc5qOYK9DtVaqj1JurCFA4YLFn1gudz3yT0NZ1ONGa5qhPSDQ33fKNZhczlkEnAgtaCPHDLaYZ7c7I6Hp3RX3OyCJRWudmywYvQqSZtC1ZHH7j6jYcGyG0ApGJiKuRPVjGUhqSlqeuRAiOSUOQ4qtJrVFN3wBVT0nXv72Ddr1KsUTNTa5c2946lcKxQat9mjBwt2FrHNkXSPHymzOWBm8eMoX6DlmBLK3N0XILiSO3eUTBeKDE0Iuxh7Q27msI7iLGtDTnLddbPGcIRcETTnApLMDtCVrXxZQxoHuuVw6j3cAtj8NI73r4uxy6VGK3LevvLgJQM8nqcoF7Hn0lGoZHjQjTgeHJxLwDl4esfS4GnYRFRIQlIYUPKYznKD4SGPnlSzME7H4TCuhVqabjn5SBwW3N9CqGF4O1iaVzfhs77rVi4DbAVqvuKSscwUpIR60U5b3HoPEx4SOdhw8YBswAwHaqoh5aE0uaihlEF5xJAQM4mgqs8myDtCMd1WGbYiZMjd7zUgyUIXWnLMXch7yP6c0DcdhPn5hxt0FtcGp0sU7hxNgIN4ePVWsGIi9b74kVXhcDOCO83YmqG3eMtUm9jKmKDWQyhYhswCms11") #1001 chars
        self.assertNotEqual("6yWcC4W8mj5EGL686wYKTtDkIGrX0CAgS92ll9R47MgkKbSI66rWnk7y490hXP7wK8Y1bmdkAJrmtYVJ52IcMynYYz5YBwFSptiugcUclJlCxUkeGiS1ZnKP3o7jKwtkCf33rhwv8V3wJYQVLTg8KpOgjmQQHpRfGlv2zJGcukayda2CN9jQzo2nlQpfWzNVgvsNmgBZzskAYjmd2gxASfBHCGeOXzR2ui652z7HIRIrYrm2LEOwm9evex7sN1TazauvRTKKCa2av5AGeQsXCIqy1QXtQbClxkvFNY1yqPe205QkrdGwS8YavAqfMdIjje7mSlxklntVkQAJeKL9XuctwhFidQewwdpZ1q0PEBpUcF2U7xzJOYqIcMJoUqf2FFc5qOYK9DtVaqj1JurCFA4YLFn1gudz3yT0NZ1ONGa5qhPSDQ33fKNZhczlkEnAgtaCPHDLaYZ7c7I6Hp3RX3OyCJRWudmywYvQqSZtC1ZHH7j6jYcGyG0ApGJiKuRPVjGUhqSlqeuRAiOSUOQ4qtJrVFN3wBVT0nXv72Ddr1KsUTNTa5c2946lcKxQat9mjBwt2FrHNkXSPHymzOWBm8eMoX6DlmBLK3N0XILiSO3eUTBeKDE0Iuxh7Q27msI7iLGtDTnLddbPGcIRcETTnApLMDtCVrXxZQxoHuuVw6j3cAtj8NI73r4uxy6VGK3LevvLgJQM8nqcoF7Hn0lGoZHjQjTgeHJxLwDl4esfS4GnYRFRIQlIYUPKYznKD4SGPnlSzME7H4TCuhVqabjn5SBwW3N9CqGF4O1iaVzfhs77rVi4DbAVqvuKSscwUpIR60U5b3HoPEx4SOdhw8YBswAwHaqoh5aE0uaihlEF5xJAQM4mgqs8myDtCMd1WGbYiZMjd7zUgyUIXWnLMXch7yP6c0DcdhPn5hxt0FtcGp0sU7hxNgIN4ePVWsGIi9b74kVXhcDOCO83YmqG3eMtUm9jKmKDWQyhYhswCms11", firstPost.getPost())

    # also tests getCommunity
    def test_setCommunity(self):
        firstPost = Post.objects.get(post = "Hello world")
        newCommunity = Community.objects.get(name = "sleep")

        ##test that Post was constructed correctly (in setUp)
        self.assertEqual("fitness", firstPost.getCommunity().getName())

        ##test changing the Community a Post is in
        firstPost.setCommunity(newCommunity)
        self.assertEqual(newCommunity, firstPost.getCommunity())

    # also tests getPoster
    def test_setPoster(self):
        firstPost = Post.objects.get(post = "Hello world")
        fitnessUser = User.objects.get(username = "emil")
        fitnessUser2 = User.objects.get(username = "jersey")

        ##test that Post was constructed correctly (in setUp)
        self.assertEqual(fitnessUser, firstPost.getPoster())

        ##test changing the User that posted a Post
        firstPost.setPoster(fitnessUser2)
        self.assertEqual(fitnessUser2, firstPost.getPoster())

class CommentTestCase(TestCase):

    def setUp(self):
        Community.objects.create(name = "fitness")
        Community.objects.create(name = "sleep")
        User.objects.create(username = "emil")
        User.objects.create(username = "jersey")
        fitnessCommunity = Community.objects.get(name = "fitness")
        fitnessUser = User.objects.get(username = "emil")
        fitnessUser2 = User.objects.get(username = "jersey")
        Post.objects.create(post = "Hello world", community = fitnessCommunity, poster = fitnessUser)
        Post.objects.create(post = "Bye world", community = fitnessCommunity, poster = fitnessUser)
        p = Post.objects.get(post = "Hello world")
        Comment.objects.create(post = "Wow, hi!", community = fitnessCommunity, poster = fitnessUser2, originalPost = p)

    def test_getOriginalPost(self):
        firstComment = Comment.objects.get(post = "Wow, hi!")
        firstPost = Post.objects.get(post = "Hello world")

        self.assertEqual(firstPost, firstComment.getOriginalPost())

    def test_setOriginalPost(self):
        firstComment = Comment.objects.get(post = "Wow, hi!")
        firstPost = Post.objects.get(post = "Hello world")
        secondPost = Post.objects.get(post = "Wow, hi!")

        self.assertEqual(firstPost, firstComment.getOriginalPost())
        firstComment.setOriginalPost(secondPost)
        self.assertEqual(secondPost, firstComment.getOriginalPost())
