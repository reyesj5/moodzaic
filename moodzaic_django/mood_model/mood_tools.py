import json

from mood_model.mood_neural_network import MoodNeuralNetwork

baseModel = MoodNeuralNetwork()
emotions = baseModel.getEmotions()
emotion_map = {}
for i in range(len(emotions)):
    emotion_map[emotions[i]] = i
with open('static/notifications.txt','r', encoding="utf-8") as file: # Use file to refer to the file object
    data = file.read().splitlines()
reminders = {}
curr = ""
for i in range(len(data)):
    if data[i] in emotion_map:
        reminders[data[i]] = []
        curr = data[i]
    else:
        reminders[curr].append(data[i])
with open('static/notifications.json', 'w', encoding="utf-8") as fp:
    json.dump(reminders, fp)

def getReminders():
    return reminders

def getEmotions():
    return ['Fear', 'Sad', 'Hesitant', 'Calm', 'Happy']
