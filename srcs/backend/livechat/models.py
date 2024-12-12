from django.db import models

class Message(models.Model):
    nickname = models.CharField(max_length=30)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    room = models.CharField(max_length=50, null=True, db_index=True)  # Add indexed room field
    is_game_chat = models.BooleanField(default=False)  # Flag for game messages

    class Meta:
        indexes = [
            models.Index(fields=['room', '-timestamp']),  # Optimize room+timestamp queries
        ]

    def __str__(self):
        room_info = f'(room: {self.room})' if self.room else ''
        return f'{self.nickname}: {self.content} {room_info}'