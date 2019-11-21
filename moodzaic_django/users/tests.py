from django.test import TestCase
from users.models import User, Profile, Goal, Mood, Observation
from datetime import datetime, date
from community.models import Community, Post
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

# Every user has a profile being tested here
class ProfileTestCase(TestCase):
    def setUp(self):
        u1 = User.objects.create(username = "emil", password = "snibby")
        u2 = User.objects.create(username = "harry", password = "lobber")
        Profile.objects.create(ProgressScore = 10, user = User.objects.get(username = "emil"))
        Profile.objects.create(ProgressScore = 11, user = User.objects.get(username = "harry"))
        Goal.objects.create(goal = "Drink water", frequency = "5", time = datetime.now())
        c1 = Community.objects.create(name="FitBois")
        c1.addUserToCommunity(u1)
    def test_setProgressScore(self):
        testProfile = Profile.objects.get(ProgressScore = 10)
        self.assertEqual(10, testProfile.getProgressScore())
        testProfile.setProgressScore(5)
        self.assertEqual(5, testProfile.getProgressScore())
    def test_setProgressScoreNeg(self):
        testProfile = Profile.objects.get(ProgressScore = 10)
        testProfile.setProgressScore(-5)
        self.assertEqual(-5, testProfile.getProgressScore())

    def test_makePost(self):
        testProfile = Profile.objects.get(ProgressScore= 10)
        self.assertTrue(testProfile.makePost("Hi, this is a post", "FitBois"))
    def test_makePost_NullPost(self):
        testProfile = Profile.objects.get(ProgressScore= 10)
        self.assertFalse(testProfile.makePost("", "FitBois"))
    def test_makePost_UserNotInSet(self):
        testProfile = Profile.objects.get(ProgressScore= 11)
        self.assertFalse(testProfile.makePost("Yup", "FitBois"))
    def test_getUser(self):
        testProfile = Profile.objects.get(ProgressScore= 10)
        testUser =User.objects.get(username = "emil")
        self.assertEqual(testUser.username, "emil")
    def test_setProfileAgeSuccess(self):
        testProfile = Profile.objects.get(ProgressScore= 10)
        testProfile.setAge(21)
        self.assertEqual(21, testProfile.age)
    def test_setUserAgeTooYoungFailure(self):
        testProfile = Profile.objects.get(ProgressScore= 10)
        self.assertFalse(testProfile.setAge(17))
    def test_setUserAgeTooOldFailure(self):
        testProfile = Profile.objects.get(ProgressScore= 10)
        self.assertFalse(testProfile.setAge(121))
    def test_setUserAgeNotIntFailure(self):
        testProfile = Profile.objects.get(ProgressScore= 10)
        self.assertFalse(testProfile.setAge("emil"))

    def test_setUserGenderManSuccess(self):
        testProfile = Profile.objects.get(ProgressScore= 10)
        testProfile.setGender('man')
        self.assertEqual('man', testProfile.gender)
    def test_setUserGenderWomanSuccess(self):
        testProfile = Profile.objects.get(ProgressScore= 10)
        testProfile.setGender('woman')
        self.assertEqual('woman', testProfile.gender)
    def test_setUserGenderNonbinarySuccess(self):
        testProfile = Profile.objects.get(ProgressScore= 10)
        testProfile.setGender('nonbinary')
        self.assertEqual('nonbinary', testProfile.gender)
    def test_setUserGenderFailureLong(self):
        testProfile = Profile.objects.get(ProgressScore= 10)
        self.assertFalse(testProfile.setGender('gibberishh'))
    def test_setUserGenderFailureType(self):
        testProfile = Profile.objects.get(ProgressScore= 10)
        self.assertFalse(testProfile.setGender(4))

# Observations are asked daily and stored in the database
class ObservationTestCase(TestCase):
    def setUp(self):
        Observation.objects.create(
            sleep = 7,
            exercise = 3,
            meals = 2,
            mood = Mood.objects.create(name = "sad", mood = 2)
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
        testObservation.setWork(7)
        self.assertEqual(testObservation.work, 7)
    def test_setWork_negative(self):
        testObservation = Observation.objects.get(sleep = 7)
        testObservation.setWork(-7)
        self.assertEqual(testObservation.work, -1)
    def test_setWork_tooHigh(self):
        testObservation = Observation.objects.get(sleep = 7)
        testObservation.setWork(25)
        self.assertEqual(testObservation.work, -1)
    def test_setMood(self):
        testObservation = Observation.objects.get(sleep = 7)
        testObservation.setMood("happy", 3)
        self.assertEqual(testObservation.mood.name, "happy")
    def test_setMood_wrongType(self):
        testObservation = Observation.objects.get(sleep = 7)
        testObservation.setMood(3.2, 3)
        self.assertEqual(testObservation.mood.name, "sad")
    def test_setMood_wrongType(self):
        testObservation = Observation.objects.get(sleep = 7)
        self.assertFalse(testObservation.setMood("happy", "happy"))

# Testing that the user moods can set and changed
class MoodTestCase(TestCase):
    def setUp(self):
        Mood.objects.create(name = "sad", mood = 2)
    def test_setName(self):
        testMood = Mood.objects.get(mood = 2)
        testMood.setName("happy")
        self.assertEqual(testMood.name, "happy")
    def test_setName_empty(self):
        testMood = Mood.objects.get(mood = 2)
        testMood.setName("")
        self.assertEqual(testMood.name, "sad")
    def test_setMood(self):
        testMood = Mood.objects.get(mood = 2)
        testMood.setMood(6)
        self.assertEqual(testMood.mood, 6)
    def test_setMood_negative(self):
        testMood = Mood.objects.get(mood = 2)
        testMood.setMood(-66)
        self.assertEqual(testMood.mood, 2)
