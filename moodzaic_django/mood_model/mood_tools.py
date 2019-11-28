import json

emotion_map = {}

def getEmotions():
    with open('static/emotions.txt','r', encoding="utf-8") as file: # Use file to refer to the file object
        emotions = file.read().splitlines()
    return emotions

def getReminders():
    emotions = getEmotions()
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
    return reminders

# def getReminders():
#     print(reminders)
#     return reminders
#
# def getEmotions():
#     return ['Fear', 'Sad', 'Hesitant', 'Calm', 'Happy']

if __name__ == "__main__":
    getReminders()
