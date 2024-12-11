from django.db import models

class Message(models.Model):
    nickname = models.CharField()
    content = models.TextField()
    timestamp = models.DateTimeField()

    def __str__(self):
        return f'{self.nickname}: {self.content}'