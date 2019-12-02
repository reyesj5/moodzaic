import json

emotion_map = {}

def getEmotions(file = 'static/notifications.txt'):
    with open('static/emotions.txt','r', encoding="utf-8") as file: # Use file to refer to the file object
        emotions = file.read().splitlines()
    return emotions

def getEmotionMap():
    emotions = getEmotions()
    emotion_map = {}
    for i in range(len(emotions)):
        emotion_map[emotions[i]] = i
    return emotion_map

def getReminders(file = 'static/notifications.txt'):
    emotion_map = getEmotionMap()
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
    return reminders

if __name__ == "__main__":
    getReminders()
