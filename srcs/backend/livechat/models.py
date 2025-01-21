from django.db import models

class Message(models.Model):
    nickname = models.CharField(max_length=30)
    content = models.TextField(max_length=512)
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
    
class Notification(models.Model):
    nickname_sender = models.CharField(max_length=30)
    nickname_receiver = models.CharField(max_length=30)
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField()
    timestamp = models.DateTimeField(auto_now_add=True)
    notification_type = models.CharField(max_length=50, choices=[('friend_request', 'Friend Request'), ('game_invite', 'Game Invite'), ('tournament_invite', 'Tournament Invite')])
    is_read = models.BooleanField(default=False)
    is_accepted = models.BooleanField(default=False)

    def to_dict(self):
        return {
            'content': self.content,
            'is_read': self.is_read,
            'is_accepted': self.is_accepted,
            'notification_type': self.notification_type,
            'timestamp': self.created_at.isoformat()
        }