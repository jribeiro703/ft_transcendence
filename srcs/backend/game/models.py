from django.utils.translation import gettext as _ 
from django.db import models
from user.models import User
from tournament.models import Tournament
from django.utils import timezone

class Game(models.Model):
	GAME_STATUS_CHOICES = [
		('PENDING', 'Pending'),
		('FINISHED', 'Finished'),
		('WO', 'Walkover'),
	]
	status = models.CharField(max_length=20, choices=GAME_STATUS_CHOICES, default='PENDING')

	DIFFICULTY_CHOICES = [
		('EASY', 'Easy'),
		('MEDIUM', 'Medium'),
		('HARD', 'Hard'),
	]
	difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='EASY')

	LEVEL_CHOICES = [
		('TABLETENNIS', 'Table Tennis'),
		('FOOTBALL', 'Football'),
		('TENNIS', 'Tennis'),
		('CLASSIC', 'Classic'),
	]
	level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='CLASSIC')
	created_at = models.DateTimeField(default=timezone.now)  # Automatically set when created

	player_one = models.ForeignKey(
		'user.User', null=True, blank=True, 
		related_name='game_as_player_one', on_delete=models.SET_NULL,
	)
	player1_guest = models.ForeignKey(
		'tournament.Guest', null=True, blank=True, 
		related_name='game_as_player1_guest', on_delete=models.SET_NULL,
	)
	# @yabing - you can use a display method <p>Player One: {{ game.get_player1_name }}</p>
	# instead of storing the username in the model
	username_one = models.CharField(max_length=50, blank=True, null=True)

	player_two = models.ForeignKey(
		'user.User', null=True, blank=True, 
		related_name='game_as_player_two', on_delete=models.SET_NULL,
	)
	player2_guest = models.ForeignKey(
		'tournament.Guest', null=True, blank=True, 
		related_name='game_as_player2_guest', on_delete=models.SET_NULL,
	)
	# @yabing - you can use a display method <p>Player One: {{ game.get_player2_name }}</p>
	# instead of storing the username in the model
	username_two = models.CharField(max_length=50, blank=True, null=True)

	score_one = models.PositiveIntegerField(default=0)
	score_two = models.PositiveIntegerField(default=0)
	timestamp = models.DateTimeField(auto_now_add=True)
	walkover = models.BooleanField(default=False)

	winner = models.ForeignKey(
		'user.User', null=True, blank=True,
		related_name='game_as_winner', on_delete=models.SET_NULL,
	)

	winner_guest = models.ForeignKey(
    	'tournament.Guest', null=True, blank=True, 
		related_name='game_as_winner_guest', on_delete=models.SET_NULL,
	)

	tournament = models.ForeignKey(
		'tournament.Tournament', null=True, blank=True, 
		 related_name='tournament_games', on_delete=models.CASCADE,
	)
 
	# Customization options
	powerup = models.BooleanField(default=False)  # True = Active, False = Inactive
	time_played = models.IntegerField(default=0)  # Time in seconds (or minutes)
	
	def __str__(self):
		return f"{self.id}"

	def get_player1_name(self):
		if self.player_one:
			return self.player_one.username
		elif self.player1_guest:
			return self.player1_guest.display_name
		return 'Unknown'

	def get_player2_name(self):
		if self.player_two:
			return self.player_two.username
		elif self.player2_guest:
			return self.player2_guest.display_name
		return 'Unknown'

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