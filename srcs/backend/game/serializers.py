from rest_framework import serializers
from .models import Game
from user.models import User

class GameCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Game
		fields = ('id', 'created_at', 'player_one', 'player_two', 'score_one', 'score_two', 'winner')

	def create(self, validated_data):
		game = Game.objects.create(
			player_one=validated_data['player_one'],
			player_two=validated_data['player_two'],
			score_one=validated_data['score_one'],
			score_two=validated_data['score_two'],
			created_at=validated_data['created_at'],
			winner=validated_data['winner']
    	)
		return game
