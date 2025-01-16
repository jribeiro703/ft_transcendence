from rest_framework import serializers
from .models import Game
from user.models import User

class GameCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Game
		fields = ('id', 'created_at', 'username_one', 'username_two', 'score_one', 'score_two', 'time_played', 'difficulty', 'powerup', 'level', 'winner' )
			
		# def create(self, validated_data):
		# 	game = super().create(validated_data)
		# 	if validated_data['username_one'] and validated_data['username_two']:
		# 		game.player_one = User.objects.filter(username=validated_data['username_one']).first()
		# 		game.player_two = User.objects.filter(username=validated_data['username_two']).first()
		# 	else:
		# 		raise serializers.ValidationError({"message": "one of usernames is missing"})

		# 	game.winner = game.player_one if validated_data['winner'] == validated_data['username_one'] else game.player_two
		# 	game.save()

		# 	return game

	def create(self, validated_data):

		print(validated_data)
		username_one = validated_data.pop('username_one', None)
		username_two = validated_data.pop('username_two', None)
		winner_username = validated_data.pop('winner', None)

		game = super().create(validated_data)

		if username_one and username_two:
			game.player_one = User.objects.filter(username=username_one).first()
			game.player_two = User.objects.filter(username=username_two).first()
		else:
			raise serializers.ValidationError({"message": "Both usernames are required"})

		if winner_username:
			if winner_username == username_one:
				game.winner = game.player_one
			elif winner_username == username_two:
				game.winner = game.player_two
			else:
				raise serializers.ValidationError({"message": "Winner username does not match either player"})

		game.save()
		return game

