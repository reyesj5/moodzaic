import datetime

from django.core.validators import int_list_validator
from django.db import models
import numpy as np

from users.models import User, Observation
from mood_model.mood_neural_network import MoodNeuralNetwork

# Class holds the values of the Machine Learning model, which are then linked to individual users.
class Weights(models.Model):

    user = models.OneToOneField(
        User,
        unique=True,
        related_name='weights',
        on_delete='models.CASCADE',
        null=True
    )

    weights_int_list = models.TextField(
        validators=[int_list_validator],
        default=""
    )
    bias_int_list = models.TextField(
        validators=[int_list_validator],
        default=""
    )

    def setWeightsUser(self, user):
        if self.user is not None:
            return False

        self.user = user
        return True

    def setWeightsWeights(self, weights_list = False):
        if weights_list:
            if len(weights_list) != 208:
                return False

            self.weights_int_list = ",".join(str(x) for x in weights_list)
        else:
            model = MoodNeuralNetwork()
            weightDict = model.getWeights()
            weights = []
            for i in range(len(weightDict)):
                weights.append(weightDict["weight" + str(i)])
            self.setWeightsWeights(weights)
        return True

    def setWeightsBias(self, biases_list = False):
        if biases_list:
            if len(biases_list) != 21:
                return False
            self.bias_int_list = ",".join(str(x) for x in biases_list)
        else:
            model = MoodNeuralNetwork()
            biasDict = model.getBiases()
            biases = []
            for i in range(len(biasDict)):
                biases.append(biasDict["bias" + str(i)])
            self.setWeightsBias(biases)
        return True

    def getWeightBiasDictionaries(self):
        if len(self.weights_int_list) == 0:
            self.setWeightsWeights()
        if len(self.bias_int_list) == 0:
            self.setWeightsBias()
        weights = self.weights_int_list.split(',')
        biases = self.bias_int_list.split(',')
        weightDict = {}
        biasDict = {}
        for i in range(len(weights)):
            if i < 21:
                biasDict['bias' + str(i)] = float(biases[i])
            weightDict['weight' + str(i)] = float(weights[i])
        return weightDict, biasDict

    def getData(self, obs, observations, timeframe):
        today = obs.date
        timeframe_ago = today - datetime.timedelta(days=timeframe)
        timeframe_data = observations.filter(date__gte=timeframe_ago, date__lte=today)

        days_with_obs = timeframe_data.__len__
        if days_with_obs == 0:
            return 0, 0

        exercise_sum, work_sum = 0, 0

        for past_obs in timeframe.iterator():
            exercise_sum += past_obs.exercise
            work_sum += past_obs.work

        return exercise_sum, work_sum
        # return exercise_sum / days_with_obs, work_sum / days_with_obs
        # will consider averages in the future as a data point


    def transformUserData(self, timeframe):
        self.updateLongtermData(timeframe)
        profile = self.user.profile
        observations = Observation.objects.filter(user__user__username=profile.user.username)
        observations = observations.order_by("date")

        input_data = []
        mood_data = []

        if len(observations) > 0:
            today = observations[0].date.today()
            timeframe_ago = today - datetime.timedelta(days=timeframe)
            timeframe_data = observations.filter(date__gte=timeframe_ago, date__lte=today)


            for obs in timeframe_data.iterator():

                row = [
                    obs.sleep, obs.exercise, self.weeklyExercise, obs.meals,
                    obs.numberOfGoals, obs.goalsCompleted, obs.goalsMissed,
                    obs.goalsRatio, obs.pastMoodScore,
                    obs.work, self.weeklyWork
                ]
                input_data.append(row)
                mood_data.append(obs.mood)

        return np.array(input_data), np.array(mood_data)

    def retrain(self):
        weightDict, biasDict = self.getWeightBiasDictionaries()
        model = MoodNeuralNetwork(weights=weightDict, biases=biasDict)
        input_data, mood_data = self.transformUserData(30)
        model.train(input_data, mood_data)
        weightDict = model.getWeights()
        weights = []
        for i in range(len(weightDict)):
            weights.append(weightDict["weight" + str(i)])
        self.setWeightsWeights(weights)

        biasDict = model.getBiases()
        biases = []
        for i in range(len(biasDict)):
            biases.append(biasDict["bias" + str(i)])
        self.setWeightsBias(biases)

        return True

    def predict(self):
        weightDict, biasDict = self.getWeightBiasDictionaries()
        model = MoodNeuralNetwork(weights=weightDict, biases=biasDict)
        input_data, mood_data = self.transformUserData(1)
        try:
            output = model.feedforward(input_data[0])
        except:
            return -1
        mood = model.roundClass(output)
        self.updateMoodPrediction(mood)
        return mood
        #self.user.profile.setNotifications()

    def updateLongtermData(self, timeframe):
        try:
            profile = self.user.profile
            observations = Observation.objects.filter(user__user__username=profile.user.username)
            observations = observations.order_by("date")

            if len(observations) > 0:
                today = observations[0].date.today()
                timeframe_ago = today - datetime.timedelta(days=timeframe)
                timeframe_data = observations.filter(date__gte=timeframe_ago, date__lte=today)

                for obs in timeframe_data.iterator():
                    weekly_exercise, weekly_work = self.getData(obs, observations, 7)
                    obs.setWeeklyExercise(weekly_exercise)
                    obs.setWeeklyWork(weekly_work)
                    obs.save()
                return True
            return False
        except:
            return False

    def updateMoodPrediction(self, prediction):
        profile = self.user.profile
        observations = Observation.objects.filter(user__user__username=profile.user.username)
        observations = observations.order_by("date")
        try:
            today = observations[0].date.today()
            tomorrow = today - datetime.timedelta(days=-1)
            obsTomorrow = observations.filter(date__gte=tomorrow, date__lte=tomorrow)
            if len(obsTomorrow) != 0:
                for obs in obsTomorrow:
                    obs.pastMoodScore = prediction
                    obs.save()
            else:
                Observation.objects.create(
                    date = tomorrow,
                    pastMoodScore = prediction,
                    user = profile
                )
            return True
        except:
            return False
