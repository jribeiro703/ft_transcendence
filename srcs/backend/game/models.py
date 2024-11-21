from django.db import models
from user.models import User
# ensures that _ is defined as a shortcut for the gettext function for internationalization (i18n)
from django.utils.translation import gettext as _ 

class Game(models.Model):
	# id = models.UUIDField(primary_key=True, default=models.uuid4, editable=False) # PK
	player_one = models.ForeignKey(User, related_name='game_as_player_one', on_delete=models.SET_NULL, null=True) # FK to User
	player_two = models.ForeignKey(User, related_name='game_as_player_two', on_delete=models.SET_NULL, null=True) # FK to User
	winner = models.ForeignKey(User, related_name='game_as_winner', on_delete=models.SET_NULL, null=True) # FK to User
	
	score_one = models.IntegerField(default=0)
	score_two = models.IntegerField(default=0)
	max_score = models.IntegerField(default=10)
	
	# tournament_id = models.ForeignKey(Tournament, related_name='games', on_delete=models.CASCADE, null=True) # FK to Tournament
	
	created_at = models.DateTimeField(auto_now_add=False) # match will be created at frontend
	start_time = models.DateTimeField(null=True, blank=True)
	end_time = models.DateTimeField(null=True, blank=True)

	def __str__(self):
		return (f"Match started at {self.created_at}")

class GamePlayer(models.Model):
	# id = models.UUIDField(primary_key=True, default=models.uuid4, editable=False) # PK
	game_id = models.ForeignKey(Game, related_name='game_players', on_delete=models.CASCADE)  # FK to Game
	user_id = models.ForeignKey(User, related_name='game_participations', on_delete=models.CASCADE)  # FK to User
	display_name = models.CharField(max_length=50, blank=True, null=True)
	is_winner  = models.BooleanField(default=False)

	def __str__(self):
		return (f"Player {self.user.username} in Game {self.game.id}")