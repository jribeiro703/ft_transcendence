from django.db import models
# ensures that _ is defined as a shortcut for the gettext function for internationalization (i18n)
# helps for lazy references to avoid circular dependencies
from django.utils.translation import gettext as _ 

class Tournament(models.Model):
	created_by = models.ForeignKey(
		'user.User', related_name='created_tournaments', on_delete=models.CASCADE
	)
	created_at = models.DateTimeField(auto_now_add=True)
	start_date = models.DateTimeField(null=True, blank=True)  # Start date of the tournament
	end_date = models.DateTimeField(null=True, blank=True)  # End date of the tournament
	status = models.CharField(
		max_length=20, default="upcoming"
	)  # Options: upcoming, ongoing, finished
	players = models.ManyToManyField(
		'user.User', related_name='tournaments'
	)  # Players participating
	winner = models.ForeignKey(
		'user.User', related_name='tournaments_won', on_delete=models.SET_NULL, null=True, blank=True
	)  # Optional winner
	games = models.ManyToManyField(
		'game.Game', related_name='tournament_matchups'
	)  # Games in the tournament
	max_score = models.IntegerField(default=100)  # Tournament win threshold
	matches = models.TextField(
		blank=True, null=True
	)  # Optional: serialized or textual match summary

	def __str__(self):
		return _(f"Tournament created by {self.created_by.username} with {self.players.count()} players")
