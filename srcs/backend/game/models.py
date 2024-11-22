from django.db import models
# ensures that _ is defined as a shortcut for the gettext function for internationalization (i18n)
# helps for lazy references to avoid circular dependencies
from django.utils.translation import gettext as _ 

class Game(models.Model):
	player_one = models.ForeignKey(
		'user.User', related_name='game_as_player_one', on_delete=models.SET_NULL, null=True
	) # FK to User
	player_two = models.ForeignKey(
		'user.User', related_name='game_as_player_two', on_delete=models.SET_NULL, null=True
	) # FK to User
	winner = models.ForeignKey(
		'user.User', related_name='game_as_winner', on_delete=models.SET_NULL, null=True
	) # FK to User
	
	score_one = models.PositiveIntegerField(default=0)
	score_two = models.PositiveIntegerField(default=0)
	max_score = models.PositiveIntegerField(default=10)
	
	tournament = models.ForeignKey(
		'tournament.Tournament', related_name='tournament_games', on_delete=models.CASCADE, null=True
	) # FK to Tournament
	
	created_at = models.DateTimeField(auto_now_add=True)  # Automatically set when created
	start_time = models.DateTimeField(null=True, blank=True)
	end_time = models.DateTimeField(null=True, blank=True)

	def __str__(self):
		return f"Game {self.id} between {self.player_one} and {self.player_two}"

class GamePlayer(models.Model):
	game = models.ForeignKey(
		'game.Game', related_name='game_players', on_delete=models.CASCADE
	)  # FK to Game
	user = models.ForeignKey(
		'user.User', related_name='game_participations', on_delete=models.CASCADE
	)  # FK to User
	display_name = models.CharField(
		max_length=50, blank=True, null=True
	)
	is_winner  = models.BooleanField(default=False)

	def __str__(self):
		return f"GamePlayer {self.user_id.username} in Game {self.game_id.id}"