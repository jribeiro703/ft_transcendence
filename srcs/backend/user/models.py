from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator
from .validators import alphanumeric

class User(AbstractUser):
	# for auth
	username = models.CharField(_("username"), max_length=30, unique=True, blank=False, validators=[MinLengthValidator(3), alphanumeric])
	email = models.EmailField(_("email"), unique=False, blank=False)
	password = models.CharField(_("password"), max_length=128, validators=[MinLengthValidator(8)])
	current_password = models.CharField(_("old password"), null=True, blank=True)
	email_sent_at = models.DateTimeField(null=True, blank=True)
	otp_secret = models.CharField(max_length=32, blank=True, null=True)

	# for user profile
	alias = models.CharField(_("alias"), max_length=30, unique=True, blank=True, null=True, validators=[MinLengthValidator(3)])
	avatar = models.ImageField(_("avatar"), upload_to='media/', default='default-avatar.jpg')
	friends = models.ManyToManyField('self', related_name='friendship', symmetrical=False, blank=True, verbose_name=_("friends"))
	is_online = models.BooleanField(default=False)
	
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
