from django.db import models
from datetime import date
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime
from django.core.validators import int_list_validator
import json
import os

#from community.models import Community

'''
class User(models.Model):
    username = models.CharField(max_length=20, default='')
    password = models.CharField(max_length=20, default='')
    age = models.IntegerField(default=18)
    gender = models.CharField(max_length=9, default='')

    def setUserUsername(self, username):
        if not (isinstance(username, type('string'))):
            return False
        if len(username) > 20:
            return False
        self.username = username
        self.save()
        return True

    def setUserPassword(self, password):
        if not (isinstance(password, type('string'))):
            return False
        if len(password) > 20:
            return False
        self.password = password
        self.save()
        return True

    def setUserAge(self, age):
        if not (isinstance(age, type(1))):
            return False
        if age > 120:
            return False
        if age < 18:
            return False
        self.age = age
        self.save()
        return True

    def setUserGender(self, gender):
        if not (isinstance(gender, type('string'))):
            return False
        if gender not in ['man', 'woman', 'nonbinary']:
            return False
        self.gender = gender
        self.save()
        return True
'''
'''
class Goal(models.Model):
    goal = models.CharField(max_length=30)
    frequency = models.IntegerField(default=1)
    time = models.TimeField()

    def setGoalGoal(self, goal):
        if not (isinstance(goal, type('str'))):
            return False
        if len(goal) > 30:
            return False
        self.goal = goal
        self.save()
        return True

    def setGoalFrequency(self, frequency):
        if not (isinstance(frequency, int)):
            return False
        if frequency < 1:
            return False
        self.frequency = frequency
        self.save()
        return True

    def setGoalTime(self, time_string):
        try:
            time = datetime.strptime(time_string, '%H:%M').time()
            self.time = time
            self.save()
        except Exception as e:
            print(e)
            return False

'''
'''
class Mood(models.Model):
     name = models.CharField(max_length=20, default="")
     mood = models.IntegerField(default=0)
     #date = models.DateField('date observed', auto_now_add=True, blank=True)
     #make list of moods that will be kept track of

     def setName(self, name):
        if not (isinstance(name, type('a'))):
            return False
        if not name:
            return False
        if len(name) < 20:
            self.name = name
            self.save()
            return True
        else:
            return False

     def setMood(self, mood):
        if not (isinstance(mood, type(2))):
            return False
        if mood >= 0 and mood <= 4:
            self.mood = mood
            self.save()
            return True
        else:
            return False
'''
class Profile(models.Model):
    MoodScore = models.IntegerField(default=0)
    age = models.IntegerField(default=18)
    gender = models.CharField(max_length=9, default='')
    #reminderList = models.ListCharField(base_field=CharField, size=None)
    username = models.CharField(max_length=150, default='')
    json_data = open('users/notifications.json')
    reminder_list = json.load(json_data)
    goals=models.TextField(
        validators=[int_list_validator],
        default= "-1,-1,-1,-1"
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        related_name='profile'
    )

    def MoodToday(self):
        return True

    def MoodScoreCalc(self):
        weight = self.user.weights_set.get(user = self.user)
        mood = weight.predict()
        self.MoodScore = mood
        return self.MoodScore

    def setMoodScore(self, MoodScore):
        if (MoodScore >= 0 and MoodScore <=4):
            self.MoodScore = MoodScore
            self.save()
            return True
        else:
            return False

    def getMoodReminders(self, MoodScore):
        #mood_int can be either the predicted mood or actual mood to get reminder
        mood_dict = {0: "Sad", 1:"Fear", 2: "Hesitant", 3: "Calm", 4:"Happy" }
        try:
            mood_str = mood_dict[MoodScore]
        except:
            return False
        path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'notifications.json')
        try:
            with open(path, 'r') as json_data:
                data = json.load(json_data)
                reminder = data[mood_str]
        except:
            return False
        return reminder

    def setAge(self, age):
        if not (isinstance(age, type(2))):
            return False
        if age >= 18 and age <= 120:
            self.age = age
            self.save()
            return True
        else:
            return False

    def setGender(self, name):
       if not (isinstance(name, type('a'))):
           return False
       if not name:
           return False
       if len(name) <= 9:
           self.gender = name
           self.save()
           return True
       else:
           return False

    def setGoals(self, goal_type, num):
        if goal_type > 4 or goal_type < 0:
            return False
        if num < -1:
            return False
        if goal_type != 3:
            if num > 24:
                return False
        goal_list = self.goals.split(",")
        goal_list[goal_type] = str(num)
        self.goals = ",".join(str(x) for x in goal_list)
        return True
    '''
    def makeComment(self, comment, postid, community):
        #makes comment
        if not (isinstance(comment, type('a'))):
            return False
        if not (isinstance(community, type('a'))):
            return False
        if not (isinstance(postid, type(4))):
            return False
        try:
            community = self.user.community_set.get(name = community)
        except ObjectDoesNotExist:
            return False
        try:
            post = community.post_set.get(id = postid)
        except ObjectDoesNotExist:
            return False
        if len(comment) <= 1000:
            com = community.comment_set.create(post= comment, community = community, poster =self.user, originalPost=post)
            com.save()
            return True
        else:
            return False
    '''

    def makePost(self, post, community):
        ## TODO
        #post: str
        if not (isinstance(post, type('a'))):
            return False
        if not (isinstance(community, type('a'))):
            return False
        try:
            community = self.user.community_set.get(name = community)
        except ObjectDoesNotExist:
            return False
        if len(post) > 1000:
            return False
        if not post:
            return False
        if self.user in community.users.all():
            post = community.post_set.create(post = post, community = community, poster = self.user)
            post.save()
            return True
        else:
            return False

class Observation(models.Model):
    date = models.DateField('date observed', auto_now_add=True, blank=True)
    sleep = models.FloatField(default=0)
    exercise = models.FloatField(default = 0)
    meals = models.IntegerField(default=0)
    work = models.FloatField(default=0)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True)
    predictedMood = models.IntegerField(default = 0)
    mood = models.IntegerField(default=-1)

    def setSleep(self, hours):
        if not (isinstance(hours, type(2.0))) and not (isinstance(hours, type(2))):
            return False
        if hours  >= 0 and hours <= 24:
            self.sleep = hours
            self.save()
            return True
        else:
            return False


    def setExercise(self, hours):
        if not (isinstance(hours, type(2.0))) and not (isinstance(hours, type(2))):
            return False
        if hours  >= 0 and hours <= 24:
            self.exercise = hours
            self.save()
            return True
        else:
            return False

    def setMeals(self, num):
        if not (isinstance(num, type(2))):
            return False
        if num  >= 0:
            self.meals = num
            self.save()
            return True
        else:
            return False


    def setWork(self, hours):
        if not (isinstance(hours, type(2.0))) and not (isinstance(hours, type(2))):
            return False
        if hours  >= 0 and hours <= 24:
            self.work = hours
            self.save()
            return True
        else:
            return False

    def setMood(self, mood_str, mood_int):
        if self.mood.setMood(mood_int) and self.mood.setName(mood_str):
            self.save()
            return True
        else:
            return False
