import json
from django.test import TestCase
from users.models import User, Profile, Observation
from datetime import datetime, date
from community.models import Community, Post, Comment
from users.views import *

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from collections import OrderedDict


#from status.models import Status


# Create your tests here.

# Testing user and user methods in the database
'''
class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create(username = "emil", password = "snibby")

    def test_setUsernameSuccess(self):
        testUser = User.objects.get(username = "emil")
        testUser.setUserUsername("emil1")
        self.assertEqual("emil1", testUser.username)
    def test_setUsernameLengthFailure(self):
        testUser = User.objects.get(username = "emil")
        self.assertFalse(testUser.setUserUsername("123456789012345678901"))
    def test_setUsernameNotStringFailure(self):
        testUser = User.objects.get(username = "emil")
        self.assertFalse(testUser.setUserUsername(13))

    def test_setUserPasswordSuccess(self):
        testUser = User.objects.get(username = "emil")
        testUser.setUserPassword("snibby2")
        self.assertEqual("snibby2", testUser.password)
    def test_setUserPasswordTooLongFailure(self):
        testUser = User.objects.get(username = "emil")
        self.assertFalse(testUser.setUserPassword("123456789012345678901"))
    def test_setUserPasswordTooShortFailure(self):
        testUser = User.objects.get(username = "emil")
        self.assertFalse(testUser.setUserPassword("1234567"))

    def test_setUserAgeSuccess(self):
        testUser = User.objects.get(username = "emil")
        testUser.setUserAge(21)
        self.assertEqual(21, testUser.age)
    def test_setUserAgeTooYoungFailure(self):
        testUser = User.objects.get(username = "emil")
        self.assertFalse(testUser.setUserAge(17))
    def test_setUserAgeNotIntFailure(self):
        testUser = User.objects.get(username = "emil")
        self.assertFalse(testUser.setUserAge("emil"))

    def test_setUserGenderManSuccess(self):
        testUser = User.objects.get(username = "emil")
        testUser.setUserGender('man')
        self.assertEqual('man', testUser.gender)
    def test_setUserGenderWomanSuccess(self):
        testUser = User.objects.get(username = "emil")
        testUser.setUserGender('woman')
        self.assertEqual('woman', testUser.gender)
    def test_setUserGenderNonbinarySuccess(self):
        testUser = User.objects.get(username = "emil")
        testUser.setUserGender('nonbinary')
        self.assertEqual('nonbinary', testUser.gender)
    def test_setUserGenderFailure(self):
        testUser = User.objects.get(username = "emil")
        self.assertFalse(testUser.setUserGender('gibberish'))
'''
'''
# Testing the goals a user can set and keep track of
class GoalTestCase(TestCase):
    def setUp(self):
        Goal.objects.create(goal = "Drink water", frequency = "5", time = "16:00 AM")

    def test_setGoalGoalSuccess(self):
        testGoal = Goal.objects.get(goal = "Drink water")
        testGoal.setGoalGoal("Drink more water")
        self.assertEqual("Drink more water", testGoal.goal)
    def test_setGoalGoalLengthFailure(self):
        testGoal = Goal.objects.get(goal = "Drink water")
        self.assertFalse(testGoal.setGoalGoal("1234567890123456789012345678901"))
    def test_setGoalGoalNotStringFailure(self):
        testGoal = Goal.objects.get(goal = "Drink water")
        self.assertFalse(testGoal.setGoalGoal(1))

    def test_setGoalFrequencySuccess(self):
        testGoal = Goal.objects.get(goal = "Drink water")
        testGoal.setGoalFrequency(3)
        self.assertEqual(3, testGoal.frequency)
    def test_setGoalFrequencyNotIntFailure(self):
        testGoal = Goal.objects.get(goal = "Drink water")
        self.assertFalse(testGoal.setGoalFrequency("emil"))
    def test_setGoalFrequencyNegativeFailure(self):
        testGoal = Goal.objects.get(goal = "Drink water")
        self.assertFalse(testGoal.setGoalFrequency(-5))

    def test_setGoalTimeSuccess(self):
        testGoal = Goal.objects.get(goal = "Drink water")
        testGoal.setGoalTime("14:00")
        testTime = testGoal.time.strftime('%H:%M')
        self.assertEqual("14:00", testTime)
    def test_setGoalTimeAMPMFormatFailure(self):
        testGoal = Goal.objects.get(goal = "Drink water")
        self.assertFalse(testGoal.setGoalTime("2:00 PM"))
    def test_setGoalTimeNoPaddingFailure(self):
        testGoal = Goal.objects.get(goal = "Drink water")
        self.assertFalse(testGoal.setGoalTime("1:00"))
    def test_setGoalTimeNotStringFailure(self):
        testGoal = Goal.objects.get(goal = "Drink water")
        self.assertFalse(testGoal.setGoalTime(2))
    def test_setGoalTimeBadHourFailure(self):
        testGoal = Goal.objects.get(goal = "Drink water")
        self.assertFalse(testGoal.setGoalTime("25:19"))
    def test_setGoalTimeBadMinuteFailure(self):
        testGoal = Goal.objects.get(goal = "Drink water")
        self.assertFalse(testGoal.setGoalTime("13:62"))
'''

# Every user has a profile being tested here
class ProfileTestCase(TestCase):
    def setUp(self):
        u1 = User.objects.create(username = "emil", password = "snibby")
        u2 = User.objects.create(username = "harry", password = "lobber")
        Profile.objects.create(MoodScore = 2, user = User.objects.get(username = "emil"))
        Profile.objects.create(MoodScore = 4, user = User.objects.get(username = "harry"))
        #Goal.objects.create(goal = "Drink water", frequency = "5", time = datetime.now())
        c1 = Community.objects.create(name="FitBois")
        c1.addUserToCommunity(u1)
        p1 =Post.objects.create(post = "hey y'all", community= c1, poster = u1)
        p1_id = p1.id
    def test_setMoodScore(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertTrue(testProfile.setMoodScore(3))
    def test_setMoodScoreNeg(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.setMoodScore(-5))
    def test_setMoodScoreTooHigh(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.setMoodScore(14))
    def test_setGoals(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertTrue(testProfile.setGoals(3, 9))
    def test_setGoalsNegType(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.setGoals(-3, 9))
    def test_setGoalsNegNum(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.setGoals(3, -9))
    def test_setGoalsTypeTooHigh(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.setGoals(7, 9))
    def test_setGoalsNumTooHigh(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.setGoals(2, 25))


    def test_makePost(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertTrue(testProfile.makePost("Hi, this is a post", "FitBois"))
    def test_makePost_NullPost(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.makePost("", "FitBois"))
    def test_makePost_UserNotInSet(self):
        testProfile = Profile.objects.get(MoodScore = 4)
        self.assertFalse(testProfile.makePost("Yup", "FitBois"))
    '''
    def test_makeComment(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        testPost = Post.objects.get(post = "hey y'all")
        self.assertTrue(testProfile.makeComment("Hi, this is a post",testPost.id,  "FitBois"))
    def test_makeCommentNull(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertTrue(testProfile.makeComment("",testPost.id,  "FitBois"))
    def test_makeCommentUserNotInSet(self):
        testProfile = Profile.objects.get(MoodScore = 4)
        self.assertTrue(testProfile.makeComment("Hi, this is a post",testPost.id,  "FitBois"))
    '''
    def test_getUser(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        testUser =User.objects.get(username = "emil")
        self.assertEqual(testUser.username, "emil")
    def test_setProfileAgeSuccess(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        testProfile.setAge(21)
        self.assertEqual(21, testProfile.age)
    def test_setUserAgeTooYoungFailure(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.setAge(17))
    def test_setUserAgeTooOldFailure(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.setAge(121))
    def test_setUserAgeNotIntFailure(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.setAge("emil"))

    def test_setUserGenderManSuccess(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        testProfile.setGender('man')
        self.assertEqual('man', testProfile.gender)
    def test_setUserGenderWomanSuccess(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        testProfile.setGender('woman')
        self.assertEqual('woman', testProfile.gender)
    def test_setUserGenderNonbinarySuccess(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        testProfile.setGender('nonbinary')
        self.assertEqual('nonbinary', testProfile.gender)
    def test_setUserGenderFailureLong(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.setGender('gibberishh'))
    def test_setUserGenderFailureType(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.setGender(4))
    def test_getMoodReminder_str(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        reminder = testProfile.getMoodReminders(1)
        self.assertEqual(reminder[0], "Your fear isn\u2019t always a sign you\u2019re about to make the wrong move.")
    def test_getMoodReminder_invalidstr(self):
        testProfile = Profile.objects.get(MoodScore = 2)
        self.assertFalse(testProfile.getMoodReminders('Tired'))

# Observations are asked daily and stored in the database
class ObservationTestCase(TestCase):
    def setUp(self):
        Observation.objects.create(
            sleep = 7,
            exercise = 3,
            meals = 2,
            mood = 1
        )
    def test_setSleep(self):
        testObservation = Observation.objects.get(sleep = 7)
        testObservation.setSleep(4)
        self.assertEqual(testObservation.sleep, 4)
    def test_setSleep_negative(self):
        testObservation = Observation.objects.get(sleep = 7)
        testObservation.setSleep(-5)
        self.assertEqual(testObservation.sleep, 7)
    def test_setSleep_tooHigh(self):
        testObservation = Observation.objects.get(sleep = 7)
        testObservation.setSleep(25)
        self.assertEqual(testObservation.sleep, 7)
    def test_setExercise(self):
        testObservation = Observation.objects.get(sleep = 7)
        testObservation.setExercise(4)
        self.assertEqual(testObservation.exercise, 4)
    def test_setExercise_negative(self):
        testObservation = Observation.objects.get(sleep = 7)
        testObservation.setExercise(-4)
        self.assertEqual(testObservation.exercise, 3)
    def test_setExercise_tooHigh(self):
        testObservation = Observation.objects.get(sleep = 7)
        testObservation.setExercise(25)
        self.assertEqual(testObservation.exercise, 3)
    def test_setMeals(self):
        testObservation = Observation.objects.get(sleep = 7)
        testObservation.setMeals(3)
        self.assertEqual(testObservation.meals, 3)
    def test_setMeals_negative(self):
        testObservation = Observation.objects.get(sleep = 7)
        testObservation.setMeals(-3)
        self.assertEqual(testObservation.meals, 2)
    def test_setWork(self):
        testObservation = Observation.objects.get(sleep = 7)
        self.assertTrue(testObservation.setWork(7))
    def test_setWork_negative(self):
        testObservation = Observation.objects.get(sleep = 7)
        self.assertFalse(testObservation.setWork(-7))
    def test_setWork_tooHigh(self):
        testObservation = Observation.objects.get(sleep = 7)
        self.assertFalse(testObservation.setWork(25))
    def test_setMood(self):
        testObservation = Observation.objects.get(sleep = 7)
        self.assertTrue(testObservation.setMood(3))
    def test_setMood_tooHigh(self):
        testObservation = Observation.objects.get(sleep = 7)
        self.assertFalse(testObservation.setMood(33))
    def test_setMood_negative(self):
        testObservation = Observation.objects.get(sleep = 7)
        self.assertFalse(testObservation.setMood(-33))
    def test_setMood_wrongType(self):
        testObservation = Observation.objects.get(sleep = 7)
        self.assertFalse(testObservation.setMood("happy"))
'''
# Testing that the user moods can set and changed
class MoodTestCase(TestCase):
    def setUp(self):
        Mood.objects.create(name = "sad", mood = 2)
    def test_setName(self):
        testMood = Mood.objects.get(mood = 2)
        testMood.setName("happy")
        self.assertEqual(testMood.name, "happy")
    def test_setName1(self):
        testMood = Mood.objects.get(mood = 2)
        self.assertTrue(testMood.setName("happy"))
    def test_setName_empty(self):
        testMood = Mood.objects.get(mood = 2)
        testMood.setName("")
        self.assertEqual(testMood.name, "sad")
    def test_setName_empty1(self):
        testMood = Mood.objects.get(mood = 2)
        self.assertFalse(testMood.setName(""))
    def test_setMood(self):
        testMood = Mood.objects.get(mood = 2)
        self.assertTrue(testMood.setMood(3))
    def test_setMood_tooHigh(self):
        testMood = Mood.objects.get(mood = 2)
        self.assertFalse(testMood.setMood(6))
    def test_setMood_negative(self):
        testMood = Mood.objects.get(mood = 2)
        self.assertFalse(testMood.setMood(-6))
'''

# "View" tests check whether things GET, POST, PUT requests are handled properly in the backend

class ViewsUserTest(APITestCase):
    def setUp(self):
        client = APIClient()
        self.user1 = {"username": "emil", "password": "snibby", "first_name": "name", "last_name": "lastname", "email": "email@email.ema"}
        self.user2 = {"username": "marco", "password": "dogdog", "first_name": "name", "last_name": "lastname", "email": "dog@email.ema"}

    # testing the GET request for all users
    def test_allUsers(self):
        url = '/api/all/users/'
        # No users exist
        response = self.client.get(url, format="json")
        self.assertEqual(json.loads(response.content), [])

        # Only user1 is a user
        User.objects.create(**self.user1)
        response = self.client.get(url, format="json")
        self.assertEqual(json.loads(response.content), [self.user1])

        # Both user1 and user2 are users
        User.objects.create(**self.user2)
        response = self.client.get(url, format="json")
        self.assertEqual(json.loads(response.content), [self.user1, self.user2])


    #testing the ability to GET an individual user
    def test_getUser(self):
        User.objects.create(**self.user1)
        User.objects.create(**self.user2)

        response = self.client.get('/api/users/emil', format="json")
        user = json.loads(response.content)
        self.assertEqual(json.loads(response.content), self.user1)

        response = self.client.get('/api/users/marco', format="json")
        user = json.loads(response.content)
        self.assertEqual(json.loads(response.content), self.user2)

        response = self.client.get('/api/users/potato', format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_updateUser(self):
        User.objects.create(**self.user1)
        User.objects.create(**self.user2)

        # should succeed since the change is valid
        user1Changed = {"username": "emil", "password": "snibby", "first_name": "name", "last_name": "lastname", "email": "dog@dog.dog"}
        response = self.client.put('/api/update/emil', user1Changed,  format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # number of objects is the same as before
        self.assertEqual(User.objects.count(), 2)
        # the email has been changed
        self.assertEqual(User.objects.first().email, "dog@dog.dog")

        # should fail since change is invalid
        user1ChangedBadEmail = {"username": "emil", "password": "snibby", "first_name": "name", "last_name": "lastname", "email": "dog"}
        response = self.client.put('/api/update/marco', user1ChangedBadEmail,  format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 2)
        self.assertNotEqual(User.objects.first().email, "dog")

        # should fail since username already exists
        user1ChangedToExistingUser = {"username": "marco", "password": "snibby", "first_name": "name", "last_name": "lastname", "email": "dog"}
        response = self.client.put('/api/update/emil', user1ChangedToExistingUser,  format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 2)
        self.assertNotEqual(User.objects.first().username, "marco")
        self.assertEqual(User.objects.last().username, "marco")

    def test_createUser(self):
        # successful user1 creation
        response = self.client.post('/api/create/user', self.user1, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # checking that the user was created successfully
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.last().username, "emil")

        # successful user2 creation
        response = self.client.post('/api/create/user', self.user2, format="json")
        self.assertEqual(respose.status_code, status.HTTP_200_OK)

        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(User.objects.last().username, "marco")

        # failed user creation, repeated user
        response = self.client.post('/api/create/user', self.user2, format="json")
        self.assertEqual(respose.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 2)


class ViewsProfileTest(APITestCase):
    def setUp(self):
        client = APIClient()
        self.user1 = {"username": "emil", "password": "snibby", "first_name": "name", "last_name": "lastname", "email": "email@email.ema"}
        self.user2 = {"username": "marco", "password": "dogdog", "first_name": "name", "last_name": "lastname", "email": "dog@email.ema"}

        actUser1 = User.objects.create(**self.user1)
        User.objects.create(**self.user2)

        self.profile1 = {"MoodScore" : 2,
        "age": 20,
        "gender": "man",
        "username": "emil",
        "user": actUser1 }

        self.profile2 = {"MoodScore" : 2,
        "age": 20,
        "gender": "man",
        "username": "emil",
        "user": self.user1 }

        Profile.objects.create(**self.profile1)


    def test_getProfile(self):
        response = self.client.get('/api/profiles/emil', format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        profile = json.loads(response.content)
        self.assertEqual(profile, self.profile1)

        response = self.client.get('/api/profiles/dog', format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_createProfile(self):
        url = '/api/create/profile'
        data = self.profile2
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(Profile.objects.get().username, 'emil')

    def test_updateProfile(self):
        url = '/api/create/profile'
        data = self.profile2
        response = self.client.post(url, data, format='json')

        data['age'] = 50
        response = self.client.put('api/profiles/emil', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(Profile.objects.get().age, 50)
        self.assertEqual(Profile.objects.get().name, 'emil')

class ViewsObservationsTest(APITestCase):
    def setUp(self):

        client = APIClient()

        self.user1 = {"username": "emil", "password": "snibby", "first_name": "name", "last_name": "lastname", "email": "email@email.ema"}
        userObject = User.objects.create(**self.user1)

        self.profile1 = {"MoodScore" : 2,
        "age": 20,
        "gender": "man",
        "username": "emil",
        "user": userObject }

        self.profile2 = {"MoodScore" : 2,
        "age": 20,
        "gender": "man",
        "username": "emil",
        "user": self.user1 }

        profileObject = Profile.objects.create(**self.profile1)
        userId = Profile.objects.get().id


        self.observation1 = {'sleep': '7',
            'exercise':'3',
            'meals':'2',
            'mood': 'Revolted',
            'user': userId}
        self.observation2 = {'sleep': '9',
            'exercise':'4',
            'meals':'3',
            'mood': 'Revulsion',
            'user': userId}

    def test_getAllUserObservation(self):
        url = '/api/observations/create/emil'
        data = self.observation2
        response = self.client.post(url, data, format="json")

        data = self.observation1
        response = self.client.post(url, data, format="json")

        url = '/api/observations/emil'
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        testList = [self.observation1, self.observation2]
        self.assertEqual(len(json.loads(response.content)), 2)
    
    def test_postObservation(self):
        url = '/api/observations/create/emil'
        data = self.observation2
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        observation = Observation.objects.get()
        self.assertEqual(observation.sleep, 9)
        self.assertEqual(observation.exercise, 4)
        self.assertEqual(observation.mood, 3)


        data = self.observation1
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)