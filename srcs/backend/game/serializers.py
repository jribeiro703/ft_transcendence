from rest_framework import serializers, exceptions
from .models import Game

class RegisterGameSerializer(serializers.ModelSerializer):

	player_one = serializers.StringRelatedField()
	player_two = serializers.StringRelatedField()
	winner = serializers.StringRelatedField()

	class Meta:
		model = Game
		fields = ('id', 'created_at', 'player_one', 'player_two', 'score_one', 'score_two', 'winner')