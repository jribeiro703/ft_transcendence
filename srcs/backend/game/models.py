# ensures that _ is defined as a shortcut for the gettext function for internationalization (i18n)
# helps for lazy references to avoid circular dependencies
from django.utils.translation import gettext as _ 
from django.db import models
from user.models import User
from tournament.models import Tournament
from django.utils import timezone

class Game(models.Model):
	GAME_STATUS_CHOICES = [
		('NOT_STARTED', 'Not Started'),
		('ONGOING', 'Ongoing'),
		('PAUSED', 'Paused'),
		('COMPLETED', 'Completed'),
		('CANCELED', 'Canceled'),
	]
	status = models.CharField(max_length=20, choices=GAME_STATUS_CHOICES, default='NOT_STARTED')

	DIFFICULTY_CHOICES = [
		('EASY', 'easy'),
		('MEDIUM', 'medium'),
		('HARD', 'hard'),
	]
	difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='EASY')

	LEVEL_CHOICES = [
		('TABLETENNIS', 'tableTennis'),
		('FOOTBALL', 'football'),
		('TENNIS', 'tennis'),
		('CLASSIC', 'classicPong'),
	]
	level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='CLASSIC')

	player_one = models.ForeignKey(
		'user.User', related_name='game_as_player_one', on_delete=models.SET_NULL, null=True
	) # FK to User
	player_two = models.ForeignKey(
		'user.User', related_name='game_as_player_two', on_delete=models.SET_NULL, null=True
	) # FK to User
	score_one = models.PositiveIntegerField(default=0)
	score_two = models.PositiveIntegerField(default=0)

	winner = models.ForeignKey(
		'user.User', related_name='game_as_winner', on_delete=models.SET_NULL, null=True
	) # FK to User
	tournament = models.ForeignKey(
		'tournament.Tournament', related_name='tournament_games', on_delete=models.CASCADE, null=True
	) # FK to Tournament
	max_score = models.PositiveIntegerField(default=10)
 
	created_at = models.DateTimeField(auto_now_add=True)  # Automatically set when created
	start_time = models.DateTimeField(null=True, blank=True)
	end_time = models.DateTimeField(null=True, blank=True)

	# Customization options
	powerup = models.BooleanField(default=False)  # True = Active, False = Inactive
	time_played = models.IntegerField(default=0)  # Time in seconds (or minutes)

	def __str__(self):
		return f"Game {self.id} between {self.player_one} and {self.player_two}"

class GamePlayer(models.Model):
	PLAYER_STATUS_CHOICES = [
		('IDLE', 'Idle'),
		('READY', 'Ready'),
		('ACTIVE', 'Active'),
		('DISCONNECTED', 'Disconnected'),
		('ELIMINATED', 'Eliminated'),
	]
	status = models.CharField(max_length=20, choices=PLAYER_STATUS_CHOICES, default='IDLE')

	alias = models.CharField(
		max_length=50, blank=True, null=True
	)
	game = models.ForeignKey(
		'game.Game', related_name='game_players', on_delete=models.CASCADE
	)  # FK to Game
	user = models.ForeignKey(
		'user.User', related_name='game_participations', on_delete=models.CASCADE
	)  # FK to User
	is_winner  = models.BooleanField(default=False)

	def __str__(self):
		return f"GamePlayer {self.user.username} in Game {self.game.id}"

# 	def __str__(self):
# 		return f'{self.nickname}: {self.content}'