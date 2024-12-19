from django.db import models
# ensures that _ is defined as a shortcut for the gettext function for internationalization (i18n)
# helps for lazy references to avoid circular dependencies
from django.utils.translation import gettext as _ 
from django.core.validators import MinLengthValidator, RegexValidator
from .validators import alphanumeric
from django.db.models.signals import post_save
from django.dispatch import receiver

alphanumeric_with_spaces = RegexValidator(r'^[0-9a-zA-Z\s]*$', 'Only alphanumeric characters and spaces are allowed.')

class Tournament(models.Model):
	TOURNAMENT_STATUS_CHOICES = [
		('UPCOMING', 'Upcoming'),
		('ONGOING', 'Ongoing'),
		('COMPLETED', 'Completed'),
		('CANCELED', 'Canceled'),
	]
	status = models.CharField(
		max_length=20, choices=TOURNAMENT_STATUS_CHOICES, default="upcoming"
	)
	name = models.CharField("tournamentname", max_length=30, unique=True, blank=False, validators=[MinLengthValidator(3), alphanumeric_with_spaces])
	created_by = models.ForeignKey(
		'user.User', related_name='created_tournaments', on_delete=models.CASCADE
	)
	created_at = models.DateTimeField(auto_now_add=True)
	start_date = models.DateTimeField(null=True, blank=True)
	end_date = models.DateTimeField(null=True, blank=True)
 
	players = models.ManyToManyField(
		'user.User', related_name='tournaments'
	)
	winner = models.ForeignKey(
		'user.User', related_name='tournaments_won', on_delete=models.SET_NULL, null=True, blank=True
	)
	games = models.ManyToManyField(
		'game.Game', related_name='tournament_matchups'
	)
	max_score = models.IntegerField(default=100)
	matches = models.TextField(
		blank=True, null=True
	)

	def __str__(self):
		return _(f"Tournament {self.name} created by {self.created_by.username} with {self.players.count()} players")

	def clean(self):
		"""Validate the tournament fields."""
		if self.status == 'ONGOING' and not self.start_date:
			raise ValidationError(_("Ongoing tournaments must have a start date."))
		if self.status == 'COMPLETED' and not self.winner:
			raise ValidationError(_("Completed tournaments must have a winner."))

	def save(self, *args, **kwargs):
		"""Ensure validation and status transition rules."""
		self.clean()
		super().save(*args, **kwargs)

	def reset_player_aliases(self):
		"""Reset player aliases when the tournament starts."""
		for player in self.players.all():
			player.alias = None
			player.save()

	def add_game(self, player_one, player_two=None):
		"""Create and add a game to the tournament."""
		from game.models import Game  # Import dynamically to avoid circular imports
		game = Game.objects.create(
			player_one=player_one,
			player_two=player_two,
			tournament=self,
		)
		self.games.add(game)
		return game

	def get_bracket(self):
		"""Return a serialized bracket of matches."""
		return self.matches if self.matches else _("Bracket not available yet.")

@receiver(post_save, sender=Tournament)
def reset_aliases_on_tournament_creation(sender, instance, created, **kwargs):
	if created and instance.status == 'UPCOMING':
		instance.reset_player_aliases()
