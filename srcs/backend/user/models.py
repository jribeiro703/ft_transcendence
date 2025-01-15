from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from .validators import alphanumeric

class User(AbstractUser):
	is_42_user = models.BooleanField(default=False)

	username = models.CharField("username", max_length=30, unique=True, blank=False, validators=[MinLengthValidator(3), alphanumeric])
	email = models.EmailField("email", unique=False, blank=False)
	new_email = models.EmailField("new_email", null=True, blank=True)
	email_sent_at = models.DateTimeField(null=True, blank=True)
	password = models.CharField("password", max_length=128, validators=[MinLengthValidator(8)])
	otp_secret = models.CharField(max_length=32, blank=True, null=True)
	
	alias = models.CharField("alias", max_length=30, unique=True, blank=True, null=True, validators=[MinLengthValidator(3)])
	avatar = models.ImageField("avatar", upload_to='avatars/', default='default-avatar.jpg')
	friends = models.ManyToManyField('self', related_name='friendship', symmetrical=False, blank=True, verbose_name="friends")
	is_online = models.BooleanField(default=False)

	game_token = models.CharField(max_length=10, blank=True, null=True)

	# related_name : tournaments, game_as_player_one, game_as_player_two
	# ex: user_instance.tournaments.all() to have access to alls tournaments

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

	def __str__(self):
		return self.username

class FriendRequest(models.Model):
    sender = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.username} sent a friend request to {self.receiver.username}"

