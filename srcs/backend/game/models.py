from django.db import models
from user.models import User
from django.utils.translation import gettext_lazy as _

class Game(models.Model):
	win_treshold = models.IntegerField(default=10)
	player_one = models.ForeignKey(User, related_name='game_as_player_one', on_delete=models.SET_NULL, null=True)
	player_two = models.ForeignKey(User, related_name='game_as_player_two', on_delete=models.SET_NULL, null=True)
	score_one = models.IntegerField(default=0)
	score_two = models.IntegerField(default=0)

	# related_name = tournaments
	# game_instance.tournaments.all() to have access to alls tournaments

	winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return _(f"Match started at {self.created_at}")