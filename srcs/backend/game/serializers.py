# from rest_framework import serializers, exceptions
# from .models import Game
# from user.models import User

# class GameCreateSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = Game
# 		fields = ('id', 'created_at', 'player_one', 'player_two', 'score_one', 'score_two', 'winner')

# 	def create(self, validated_data):
# 		player_one = User.objects.get(id=validated_data['player_one_username'])
# 		player_two = User.objects.get(id=validated_data['player_two_username'])
# 		winner = User.objects.get(id=validated_data['winner_username'])
# 		game = Game.objects.create(
# 			player_one=player_one,
# 			player_two=player_two,
# 			score_one=validated_data['score_one'],
# 			score_two=validated_data['score_two'],
# 			winner=winner
#     	)
# 		return game
