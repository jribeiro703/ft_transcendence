from rest_framework import serializers
from .models import Game
from user.models import User

class GameCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Game
		fields = ('id', 'created_at', 'username_one', 'username_two', 'score_one', 'score_two', 'time_played', 'difficulty', 'powerup', 'level', 'winner' )
			
	def create(self, validated_data):
		game = super().create(validated_data)
		
		if validated_data['username_one'] and validated_data['username_two']:
			game.player_one = User.objects.filter(username=validated_data['username_one']).first()
			game.player_two = User.objects.filter(username=validated_data['username_two']).first()
		else:
			raise serializers.ValidationError({"message": "one of usernames is missing"})

		game.winner = game.player_one if validated_data['winner'] == validated_data['username_one'] else game.player_two
		game.save()
		print("game winner:", game.winner)
		return game
