from django.db import models
from datetime import date
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime
import pytz
from django.core.validators import int_list_validator
import json
import os
from mood_model import mood_tools
# from mood_model.models import Weights

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
    reminderList = models.TextField(default = '')
    username = models.CharField(max_length=150, default='')
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

    def getMoodToday(self, MoodScore):
        try:
            mood = mood_tools.getEmotions()[MoodScore]
            return mood
        except:
            return False

    def MoodScoreCalc(self):
        try:
            weight = self.user.weights
        except:
            from mood_model.models import Weights
            Weights.objects.create(
                user=self.user,
            )
            weight = self.user.weights
            weight.setWeightsWeights()
            weight.setWeightsBias()
        mood = weight.predict()
        self.MoodScore = mood
        self.save()
        return self.MoodScore

    def setMoodScore(self, MoodScore):
        if (MoodScore >= 0 and MoodScore <=len(mood_tools.getEmotions())):
            self.MoodScore = MoodScore
            self.save()
            return True
        else:
            return False

    def updateReminders(self, MoodScore):
        #mood_int can be either the predicted mood or actual mood to get reminder
        moods = mood_tools.getEmotions()
        try:
            mood_str = moods[MoodScore]
            allReminders = mood_tools.getReminders()
            newReminders = allReminders[mood_str]
        except:
            return False
        currentReminders = self.reminderList.split(';')
        nonRepeated = []
        for i in newReminders:
            try:
                currentReminders.index(i)
            except:
                nonRepeated.append(i)
        currentReminders.extend(nonRepeated)
        self.reminderList = ";".join(currentReminders)
        self.save()
        return True

    def removeReminder(self, reminder):
        #mood_int can be either the predicted mood or actual mood to get reminder
        try:
            currentReminders = self.reminderList.split(';')
            pos = currentReminders.index(reminder)
        except:
            return False
        del currentReminders[pos]
        self.reminderList = ";".join(currentReminders)
        self.save()
        return True

    def getMoodReminders(self):
        return self.reminderList

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
    date = models.DateField('date observed', default=datetime.now(pytz.timezone('US/Central')).date(), blank=True)
    sleep = models.FloatField(default=0)
    exercise = models.FloatField(default = 0)
    weeklyExercise = models.FloatField(default = 0)
    meals = models.IntegerField(default=0)
    numberOfGoals = models.IntegerField(default=0)
    goalsCompleted = models.IntegerField(default=0)
    goalsMissed = models.IntegerField(default = 0)
    goalsRatio = models.FloatField(default=0)
    pastMoodScore = models.IntegerField(default = -1)
    work = models.FloatField(default=0)
    weeklyWork = models.FloatField(default=0)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True)
    predictedMood = models.IntegerField(default = 0)
    mood = models.IntegerField(default=-1)


    def setSleep(self, hours):
        if not (isinstance(hours, type(2.0))) and not (isinstance(hours, type(2))):
            return False
        if hours  >= 0 and hours <= 24:
            self.sleep = hours * 1.0
            self.save()
            return True
        else:
            return False

    def setExercise(self, hours):
        if not (isinstance(hours, type(2.0))) and not (isinstance(hours, type(2))):
            return False
        if hours  >= 0 and hours <= 24:
            self.exercise = hours * 1.0
            self.save()
            return True
        else:
            return False

    def setWeeklyExercise(self, hours):
        if not (isinstance(hours, type(2.0))) and not (isinstance(hours, type(2))):
            return False
        if hours  >= 0:
            self.weeklyExercise = hours * 1.0
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

    def setNumberOfGoals(self, num):
        if not (isinstance(num, type(2))):
            return False
        if num  >= 0:
            self.numberOfGoals = num
            self.save()
            return True
        else:
            return False

    def setGoalsCompleted(self, num):
        if not (isinstance(num, type(2))):
            return False
        if num  >= 0:
            self.goalsCompleted = num
            self.save()
            return True
        else:
            return False

    def setGoalsMissed(self, num):
        if not (isinstance(num, type(2))):
            return False
        if num  >= 0:
            self.goalsMissed = num
            self.save()
            return True
        else:
            return False

    def setGoalsRatio(self):
        try:
            if self.goalsMissed < 1:
                ratio = self.goalsCompleted
            else:
                ratio = self.goalsCompleted*1.0/self.goalsMissed
            self.goalsRatio = ratio
            self.save()
            return True
        except:
            return False

    def setPastMoodScore(self, mood_int):
        if not (isinstance(mood_int, type(2))):
            return False
        if mood_int >=0 and mood_int <=len(mood_tools.getEmotions()):
            self.pastMoodScore = mood_int
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

    def setWeeklyWork(self, hours):
        if not (isinstance(hours, type(2.0))) and not (isinstance(hours, type(2))):
            return False
        if hours  >= 0:
            self.weeklyWork = hours * 1.0
            self.save()
            return True
        else:
            return False

    def setPredictedMood(self, mood_int):
        if not (isinstance(mood_int, type(2))):
            return False
        if mood_int >=0 and mood_int <=len(mood_tools.getEmotions()):
            self.predictedMood = mood_int
            self.save()
            return True
        else:
            return False

    def setMood(self, mood_int):
        if not (isinstance(mood_int, type(2))):
            return False
        if mood_int >=0 and mood_int <=len(mood_tools.getEmotions()):
            self.mood = mood_int
            self.save()
            return True
        else:
            return False
