from django.db import models
import uuid # Required for unique user id
from django.conf import settings # Required for MAX_UPLOAD_SIZE
from django.core.exceptions import ValidationError # Required for raising validation errors
from django.utils import timezone # Required for timezone.now()
from django.core.validators import MinLengthValidator, RegexValidator
from .validators import alphanumeric

alphanumeric_with_spaces = RegexValidator(r'^[0-9a-zA-Z\s]*$', 'Only alphanumeric characters and spaces are allowed.')

class Guest(models.Model):
	"""
	Represents a guest player in the Pong game.

	Attributes:
		id (UUIDField): The unique identifier for the guest player.
		display_name (CharField): The name displayed for the guest player.

	Methods:
		__str__(): Returns a string representation of the guest player.

	"""

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	display_name = models.CharField(max_length=100)

	def __str__(self):
		return f"{self.id}"
	

# Tournament model
class Tournament(models.Model):
	"""
	Model to represent a tournament in the application.

	Attributes:
		id (UUIDField): The unique identifier for the tournament.
		created_by (ForeignKey): The user who created the tournament.
		created_at (DateTimeField): The datetime when the tournament was created.
		status (CharField): The status of the tournament (open, closed, finished).
		winner (CharField): The winner of the tournament.
		match_count (IntegerField): The number of matches in the tournament.
		current_match (String) : "$Player1 vs $Player2" of the current match in the tournament.
		registered_users (ManyToManyField): The users registered for the tournament with a valid account.
	"""
	name = models.CharField("tournamentname", max_length=30, unique=True, blank=False, validators=[MinLengthValidator(3), alphanumeric_with_spaces])
	created_by = models.ForeignKey('user.User', related_name='created_tournaments', on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)
	status = models.CharField(max_length=50, default='open')
	winner = models.CharField(max_length=50, blank=True, default="Unknown")
	player_count = models.IntegerField(default=0)
	current_match = models.IntegerField(default=0)
	registered_users = models.ManyToManyField('user.User', related_name='registered_tournaments', blank=True)

	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		"""
		Overrides the save method to update the timestamp before saving.
		
		Usage:
			This method is automatically called by Django before saving the model instance.
			It updates the timestamp to the current datetime value before saving.
		"""
		self.created_at = timezone.now()
		super().save(*args, **kwargs)


class Match(models.Model):
	"""
	Represents a match in the Pong game.

	Attributes:
		MATCH_TYPE_CHOICES (list): Choices for the match type.
		MATCH_DIFFICULTY_CHOICES (list): Choices for the match difficulty.
		MATCH_STATUS_CHOICES (list): Choices for the match status.
		id (UUIDField): The unique identifier for the match.
		tournament (ForeignKey): The tournament the match belongs to (nullable).
		player1_user (ForeignKey): The first player as a registered user (nullable).
		player1_guest (ForeignKey): The first player as a guest (nullable).
		player2_user (ForeignKey): The second player as a registered user (nullable).
		player2_guest (ForeignKey): The second player as a guest (nullable).
		score_player1 (IntegerField): The score of the first player.
		score_player2 (IntegerField): The score of the second player.
		timestamp (DateTimeField): The timestamp when the match was created.
		status (CharField): The status of the match.
		difficulty (CharField): The difficulty level of the match.
		walkover (BooleanField): Indicates if the match was a walkover.

	Methods:
		__str__(): Returns a string representation of the match.
		get_player1_display(): Returns the display name of the first player.
		get_player2_display(): Returns the display name of the second player.
	"""

	MATCH_TYPE_CHOICES = [
		('local', 'Local'),
		('tournament', 'Tournament'),
	]
	MATCH_DIFFICULTY_CHOICES = [
		('slow', 'Slow'),
		('normal', 'Normal'),
		('fast', 'Fast'),
	]
	MATCH_STATUS_CHOICES = [
		('pending', 'Pending'),
		('finished', 'Finished'),
		('wo', 'Walkover'),
	]

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	tournament = models.ForeignKey(Tournament, null=True, blank=True, related_name='matches', on_delete=models.SET_NULL)
	player1_user = models.ForeignKey('user.User', null=True, blank=True, related_name='matches_as_player1', on_delete=models.SET_NULL)
	player1_guest = models.ForeignKey(Guest, null=True, blank=True, related_name='matches_as_player1', on_delete=models.SET_NULL)
	player2_user = models.ForeignKey('user.User', null=True, blank=True, related_name='matches_as_player2', on_delete=models.SET_NULL)
	player2_guest = models.ForeignKey(Guest, null=True, blank=True, related_name='matches_as_player2', on_delete=models.SET_NULL)
	score_player1 = models.IntegerField()
	score_player2 = models.IntegerField()
	timestamp = models.DateTimeField(auto_now_add=True)
	status = models.CharField(max_length=20, choices=MATCH_STATUS_CHOICES, default='pending')
	difficulty = models.CharField(max_length=10, choices=MATCH_DIFFICULTY_CHOICES, default='normal')
	walkover = models.BooleanField(default=False)

	def __str__(self):
		return f"Match {self.id} - {self.get_player1_display()} vs {self.get_player2_display()}"

	def get_player1_display(self):
		if self.player1_user:
			return self.player1_user.display_name
		elif self.player1_guest:
			return self.player1_guest.display_name
		return 'Unknown'

	def get_player2_display(self):
		if self.player2_user:
			return self.player2_user.display_name
		elif self.player2_guest:
			return self.player2_guest.display_name
		return 'Unknown'


class TournamentMatch(models.Model):
	"""
	Model to store the matches of a tournament.

	Attributes:
		tournament (ForeignKey): The tournament associated with the match.
		match (ForeignKey): The match in the tournament.
		position (IntegerField): The position of the match in the tournament.

	Usage:
		Use this model to store the matches of a tournament in your Django application.
	"""

	tournament = models.ForeignKey(Tournament, related_name='tournament_matches', on_delete=models.CASCADE)
	match = models.ForeignKey(Match, related_name='tournament_match', on_delete=models.CASCADE)
	position = models.IntegerField()
	player1_display_name = models.CharField(max_length=150, default='Player 1')
	player2_display_name = models.CharField(max_length=150, default='Player 2')
	
	class Meta:
		unique_together = ('tournament', 'position')
	
	def __str__(self):
		return f"Tournament {self.tournament.id}'s match {self.position} - {self.match.id}"

	def get_tournament_match(self, position):
		"""
		Returns the match at the given position in the tournament.

		Args:
			position (int): The position of the match in the tournament.

		Returns:
			TournamentMatch: The match at the given position.

		Usage:
			Use this method to get the match at a specific position in the tournament.
		"""
		return self.tournament.tournament_matches.get(position=position).match

