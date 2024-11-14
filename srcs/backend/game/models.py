from django.db import models
from user.models import User
from django.utils.translation import gettext_lazy as _

class Game(models.Model):
	created_at = models.DateTimeField(auto_now_add=False) # match will be created at frontend
	player_one = models.ForeignKey(User, related_name='game_as_player_one', on_delete=models.SET_NULL, null=True)
	player_two = models.ForeignKey(User, related_name='game_as_player_two', on_delete=models.SET_NULL, null=True)
	winner = models.ForeignKey(User, related_name='game_as_winner', on_delete=models.SET_NULL, null=True)
	score_one = models.IntegerField(default=0)
	score_two = models.IntegerField(default=0)

	# related_name = tournaments
	# game_instance.tournaments.all() to have access to alls tournaments

	def __str__(self):
		return _(f"Match started at {self.created_at}")
