from django.db import models
from game.models import Game
from user.models import User
from django.utils.translation import gettext_lazy as _

class Tournament(models.Model):
	# tournament_instance.game to get actual game instance
	game = models.ForeignKey(Game, related_name='tournaments', on_delete=models.CASCADE)
	# tournament_instance.players.all() to get alls players instance
	players = models.ManyToManyField(User, related_name='tournaments')
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return _(f"Tournament with {self.players.count()} players")
