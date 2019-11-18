from django.test import TestCase
from mood_model.models import Weights
from users.models import User, Profile, Observation, Mood
from mood_model.mood_neural_network import MoodNeuralNetwork
import numpy as np
from datetime import datetime

# Create your tests here.

# Testing the weights stored in the django database, and its functions
class WeightsTestCase(TestCase):
    def setUp(self):
        user1 = User.objects.create(username="user1", password="password1")
        user2 = User.objects.create(username="user2", password="password2")

        profile1 = Profile.objects.create(user=user1)

        mood1 = Mood.objects.create(name='Happy', mood=4)
        Observation.objects.create(date=datetime.strptime('10:20', '%H:%M').time(), sleep=4.4, exercise=1.1, meals=2, work=1.1, user=profile1, mood=mood1)

        Weights.objects.create(
            user=User.objects.get(username="user1"),
            weights_int_list=','.join(["1"] * 208),
            bias_int_list=','.join(["1"] * 21)
        )
        Weights.objects.create()


    def test_setWeightsUserSuccess(self):
        testWeights = Weights.objects.last()
        old_user = testWeights.user
        new_user = User.objects.get(username="user2")
        testWeights.setWeightsUser(new_user)
        self.assertEqual(testWeights.user, new_user)
        self.assertNotEqual(testWeights.user, old_user)

    def test_setWeightsUserFailure(self):
        testWeights = Weights.objects.first()
        old_user = testWeights.user
        new_user = User.objects.get(username="user2")
        testWeights.setWeightsUser(new_user)
        self.assertEqual(testWeights.user.username, old_user.username)
        self.assertNotEqual(testWeights.user.username, new_user.username)

    def test_setWeightsWeightsSuccess(self):
        testWeights = Weights.objects.first()
        old_weights = testWeights.weights_int_list
        new_weights = [0] * 208
        self.assertTrue(testWeights.setWeightsWeights(new_weights))
        self.assertEqual(testWeights.weights_int_list, ",".join("0" * 208))
        self.assertNotEqual(testWeights.weights_int_list, old_weights)

    def test_setWeightsWeightsFailureWrongWeightCount(self):
        testWeights = Weights.objects.first()
        old_weights = testWeights.weights_int_list
        new_weights = [1] * 207
        self.assertFalse(testWeights.setWeightsWeights(new_weights))
        self.assertNotEqual(testWeights.weights_int_list,",".join("1" * 207))
        self.assertEqual(testWeights.weights_int_list, old_weights)

    def test_setWeightsWeightsFailureWrongFormat(self):
        testWeights = Weights.objects.first()
        old_weights = testWeights.weights_int_list
        new_weights = '.'.join(["1"] * 208)
        testWeights.setWeightsWeights(new_weights)
        self.assertNotEqual(testWeights.weights_int_list, new_weights)
        self.assertEqual(testWeights.weights_int_list, old_weights)

    def test_setWeightsBiasSuccess(self):
        testWeights = Weights.objects.first()
        old_bias = testWeights.bias_int_list
        new_bias = [0] * 21
        self.assertTrue(testWeights.setWeightsBias(new_bias))
        self.assertEqual(testWeights.bias_int_list, ",".join("0" * 21))
        self.assertNotEqual(testWeights.bias_int_list, old_bias)

    def test_setWeightBiasFailureWrongBiasCount(self):
        testWeights = Weights.objects.first()
        old_bias = testWeights.bias_int_list
        new_bias = [0] * 20
        self.assertFalse(testWeights.setWeightsBias(new_bias))
        self.assertNotEqual(testWeights.bias_int_list, new_bias)
        self.assertEqual(testWeights.bias_int_list, old_bias)

    def test_setWeightBiasFailureWrongFormat(self):
        testWeights = Weights.objects.first()
        old_bias = testWeights.bias_int_list
        new_bias = '!'.join(["0"] * 21)
        self.assertFalse(testWeights.setWeightsBias(new_bias))
        self.assertNotEqual(testWeights.bias_int_list, new_bias)
        self.assertEqual(testWeights.bias_int_list, old_bias)

    def test_retrainWeights(self):
        testWeights = Weights.objects.first()
        old_weights = testWeights.weights_int_list
        testWeights.retrain()
        self.assertNotEqual(old_weights, testWeights.weights_int_list)

    def test_retrainBiases(self):
        testWeights = Weights.objects.first()
        old_biases = testWeights.bias_int_list
        testWeights.retrain()
        self.assertNotEqual(old_biases, testWeights.bias_int_list)

    def test_predict(self):
        testWeights = Weights.objects.first()
        input_data, mood_data = testWeights.transformUserData(1)
        actualMood = mood_data[0]
        mood = testWeights.predict()
        self.assertEqual(actualMood, mood)

    def test_getWeightBiasDictionaries(self):
        testWeights = Weights.objects.first()
        weightDict, biasDict = testWeights.getWeightBiasDictionaries()
        for i in range(len(weightDict)):
            self.assertTrue("weight" + str(i) in weightDict)
            if i < 21:
                self.assertTrue("bias" + str(i) in biasDict)
        self.assertEqual(len(weightDict), 208)
        self.assertEqual(len(biasDict), 21)



# Testing the methods for our neural network to predict moods
class MoodNeuralNetworkTestCase(TestCase):
    def setUp(self):
        model1 = MoodNeuralNetwork()
        weightDict, biasDict = {}, {}
        for i in range(208):
            weightDict['weight' + str(i)] = np.random.normal()
            if i < 21:
                biasDict['weight' + str(i)] = np.random.normal()
        model2 = MoodNeuralNetwork(weights=weightDict, biases=biasDict)

    def test_getWeights(self):
        weightDict, biasDict = {}, {}
        for i in range(208):
            weightDict['weight' + str(i)] = np.random.normal()
            if i < 21:
                biasDict['weight' + str(i)] = np.random.normal()
        model = MoodNeuralNetwork(weights=weightDict, biases=biasDict)
        self.assertEqual(weightDict, model.getWeights())
        self.assertTrue(model.getWeights())

    def test_getBiases(self):
        weightDict, biasDict = {}, {}
        for i in range(208):
            weightDict['weight' + str(i)] = np.random.normal()
            if i < 21:
                biasDict['bias' + str(i)] = np.random.normal()
        model = MoodNeuralNetwork(weights=weightDict, biases=biasDict)
        self.assertEqual(biasDict, model.getBiases())
        self.assertTrue(model.getBiases())

    def test_getEmotions(self):
        emotions = ['Fear', 'Sad', 'Hesitant', 'Calm', 'Happy']
        model1 = MoodNeuralNetwork()
        emotions2 = model1.getEmotions()
        self.assertEqual(emotions, emotions2)
        self.assertTrue(model1.getEmotions())

    def test_setWeights(self):
        weightDict = {}
        for i in range(208):
            weightDict['weight' + str(i)] = np.random.normal()
        model = MoodNeuralNetwork()
        self.assertNotEqual(weightDict, model.getWeights())
        self.assertTrue(model.setWeights(weightDict))
        self.assertEqual(weightDict, model.getWeights())

    def test_setBias(self):
        biasDict = {}
        for i in range(21):
            biasDict['bias' + str(i)] = np.random.normal()
        model = MoodNeuralNetwork()
        self.assertNotEqual(biasDict, model.getBiases())
        self.assertTrue(model.setBias(biasDict))
        self.assertEqual(biasDict, model.getBiases())

    def test_setEmotions(self):
        emotions = ['Love', 'Sad', 'Hesitant', 'Calm', 'Happy']
        model1 = MoodNeuralNetwork()
        emotions2 = model1.getEmotions()
        self.assertNotEqual(emotions, emotions2)
        self.assertTrue(model1.setEmotions(emotions))
        self.assertEqual(emotions, model1.getEmotions())

    def test_feedforward(self):
        weightDict, biasDict = {}, {}
        for i in range(208):
            weightDict['weight' + str(i)] = i/8
            if i < 21:
                biasDict['bias' + str(i)] = i/8
        network = MoodNeuralNetwork(weights=weightDict, biases=biasDict)
        sample_data = [2,1,4,5,6,2,6,7,3,6,6]
        self.assertEqual(1, int(network.feedforward(sample_data)[0]))
        weightDict, biasDict = {}, {}
        for i in range(208):
            weightDict['weight' + str(i)] = i/208
            if i < 21:
                biasDict['bias' + str(i)] = i/208
        network = MoodNeuralNetwork(weights=weightDict, biases=biasDict)
        sample_data = list(range(11))
        self.assertEqual(0, int(network.feedforward(sample_data)[0]))

    def test_roundClass(self):
        network = MoodNeuralNetwork()
        self.assertEqual(0, int(network.roundClass(0)))
        self.assertEqual(4, int(network.roundClass(0.999)))
        self.assertEqual(1, int(network.roundClass(0.2)))
        self.assertEqual(1, int(network.roundClass(0.3)))
        self.assertEqual(2, int(network.roundClass(0.5)))
        self.assertEqual(3, int(network.roundClass(0.7)))

    def test_activation(self):
        network = MoodNeuralNetwork()
        self.assertEqual(0.7310585786300049, network.activation(1))
        self.assertEqual(0.6224593312018546, network.activation(0.5))
        self.assertEqual(0.5, network.activation(0))
        self.assertEqual(0.3775406687981454, network.activation(-.5))
        self.assertEqual(0.549833997312478, network.activation(0.2))
        self.assertEqual(0.9999546021312976, network.activation(10))
        self.assertEqual(4.719495271526123e-20, network.activation(-44.5))
        self.assertEqual(0.52497918747894, network.activation(0.1))

    def test_deriv_activation(self):
        network = MoodNeuralNetwork()
        self.assertEqual(0, network.deriv_activation(1))
        self.assertEqual(0.25, network.deriv_activation(0.5))
        self.assertEqual(0.5, network.activation(0))
        self.assertEqual(-0.75, network.deriv_activation(-.5))
        self.assertEqual(0.16000000000000003, network.deriv_activation(0.2))
        self.assertEqual(-90, network.deriv_activation(10))
        self.assertEqual(-2024.75, network.deriv_activation(-44.5))
        self.assertEqual(0.09000000000000001, network.deriv_activation(0.1))

    def test_loss(self):
        network = MoodNeuralNetwork()
        sample_data = np.array(list(range(100)))
        sample_real = [x + 0.1 for x in list(range(0,100))]
        sample_real = np.array(sample_real)
        self.assertEqual(0.009999999999999724, network.loss(sample_data, sample_real))
        sample_real = list(range(0,100))
        self.assertEqual(0, network.loss(sample_data, sample_real))

    def test_normalize(self):
        network = MoodNeuralNetwork()
        data = np.array([list(range(11))])
        normalized = network.normalize(data)
        for j in range(len(data[0])):
            self.assertEqual(data[0][j], normalized[0][j])

    def test_train(self):
        weightDict, biasDict = {}, {}
        for i in range(208):
            weightDict['weight' + str(i)] = i
            if i < 21:
                biasDict['bias' + str(i)] = i
        network = MoodNeuralNetwork(weights=weightDict, biases=biasDict)
        sample_data = np.array([[2,1,4,5,6,2,6,7,3,6,6]])
        true = np.array([3])
        prediction = network.feedforward(sample_data[0])
        loss1 = network.loss(true, prediction)
        network.train(sample_data, true)
        prediction = network.feedforward(sample_data[0])
        loss2 = network.loss(true, network.roundClass(prediction))
        self.assertTrue(loss2 < loss1)
