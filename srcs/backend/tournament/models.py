from django.db import models
import uuid # Required for unique user id
from django.conf import settings # Required for MAX_UPLOAD_SIZE
from django.core.exceptions import ValidationError # Required for raising validation errors
from django.utils import timezone # Required for timezone.now()
from django.core.validators import MinLengthValidator, RegexValidator
from .validators import alphanumeric

alphanumeric_with_spaces = RegexValidator(r'^[0-9a-zA-Z\s]*$', 'Only alphanumeric characters and spaces are allowed.')

class Guest(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	display_name = models.CharField(max_length=100)

	def __str__(self):
		return f"{self.id}"
	

# Tournament model
class Tournament(models.Model):
	#name = models.CharField("tournamentname", max_length=30, unique=True, blank=False, validators=[MinLengthValidator(3), alphanumeric_with_spaces])
	created_by = models.ForeignKey('user.User', related_name='created_tournaments', on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)
	status = models.CharField(max_length=50, default='open')
	winner = models.CharField(max_length=50, blank=True, default="Unknown")
	player_count = models.IntegerField(default=0)
	current_match = models.IntegerField(default=0)
	registered_users = models.ManyToManyField('user.User', related_name='registered_tournaments', blank=True)

	def __str__(self):
		return self.id

	def save(self, *args, **kwargs):
		self.created_at = timezone.now()
		super().save(*args, **kwargs)


class TournamentMatch(models.Model):
	tournament = models.ForeignKey(Tournament, related_name='tournament_matches', on_delete=models.CASCADE)
	match = models.ForeignKey('game.Game', related_name='tournament_match', on_delete=models.CASCADE)
	position = models.IntegerField()
	player1_name = models.CharField(max_length=150, default='Player 1')
	player2_name = models.CharField(max_length=150, default='Player 2')
	
	class Meta:
		unique_together = ('tournament', 'position')
	
	def __str__(self):
		return f"Tournament {self.tournament.id}'s match {self.position} - {self.match.id}"

	def get_tournament_match(self, position):
		return self.tournament.tournament_matches.get(position=position).match
