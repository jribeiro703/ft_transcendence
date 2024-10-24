from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator, RegexValidator

alphanumeric = RegexValidator(r'^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')

class User(AbstractUser):
	alias = models.CharField(max_length=30, unique=True, validators=[MinLengthValidator])
	username = models.CharField(max_length=30, unique=True, blank=False, validators=[MinLengthValidator, RegexValidator])
	email = models.EmailField(unique=True, blank=False)
	avatar = models.URLField(blank=True, default='default_avatar_url')
	friends = models.ManyToManyField('self', related_name='friendship', symmetrical=False, blank=True)

	# related_name : tournaments, game_as_player_one, game_as_player_two
	# ex: user_instance.tournaments.all() to have access to alls tournaments

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email', 'alias']

	def __str__(self):
		return _(self.username)