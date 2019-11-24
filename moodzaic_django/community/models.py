from django.db import models
from users.models import User

# Create your models here.
class Community(models.Model):
    name = models.CharField(max_length=30)
    users = models.ManyToManyField(User)

    def setName(self, name):
        if (name != '') and (len(name) <= 30) and not(" " in name):
            self.name = name
            self.save()
        return

    def getName(self):
        return self.name

    def setUsers(self, listOfUsers):
        self.users.add(*listOfUsers)
        self.save()
        return

    def getUsers(self):
        return self.users.all()

    def addUserToCommunity(self, user):
        self.users.add(user)
        self.save()
        return

    def removeUserFromCommunity(self, user):
        self.users.remove(user)
        return

class Post(models.Model):
    post = models.CharField(max_length=1000)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, null=True)
    poster = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def setPost(self, post):
        if (len(post) > 0 and len(post) <= 1000):
            self.post = post
            self.save()
        return

    def getPost(self):
        return self.post

    def setCommunity(self, community):
        self.community = community
        self.save()
        return

    def getCommunity(self):
        return self.community

    def setPoster(self, poster):
        self.poster = poster
        self.save()
        return

    def getPoster(self):
        return self.poster


class Comment(Post):
    originalPost = models.ForeignKey(Post, related_name='+', on_delete=models.CASCADE)

    def getOriginalPost(self):
        return self.originalPost

    def setOriginalPost(self, originalPost):
        self.originalPost = originalPost
        self.save()
        return
