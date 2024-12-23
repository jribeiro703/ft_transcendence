from rest_framework import serializers
from .models import Game
from user.models import User

class GameCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Game
		fields = ('id', 'created_at', 'player_one', 'player_two', 'score_one', 'score_two', 'time_played', 'difficulty', 'powerup', 'level', 'winner' )
		
		def validate(self, data):
			if validated_data['player_one'] and validated_data['player_two']:
				player_one = User.objects.filter(username=validated_data['player_one']).first()
				validated_data['player_one'] = player_one.id
				player_two = User.objects.filter(username=validated_data['player_two']).first()
				validated_data['player_two'] = player_two.id
			if validated_data['winner']:
				winner = User.objects.filter(username=validated_data['winner']).first()
				validated_data['winner'] = winner.id
			return data
			
		def create(self, validated_data):
			# if validated_data['player_one'] and validated_data['player_two']:
				# player_one = User.objects.filter(username=validated_data['player_one']).first()
				# validated_data['player_one'] = player_one.id
				# player_two = User.objects.filter(username=validated_data['player_two']).first()
				# validated_data['player_two'] = player_two.id
			# if validated_data['winner']:
				# winner = User.objects.filter(username=validated_data['winner']).first()
				# validated_data['winner'] = winner.id
			
			game = Game.objects.create(
				created_at=validated_data['created_at'],
				player_one=validated_data['player_one'],
				player_two=validated_data['player_two'],
				score_one=validated_data['score_one'],
				score_two=validated_data['score_two'],
				time_played=validated_data['time_played'],
				difficulty=validated_data['difficulty'],
				powerup=validated_data['powerup'],
				level=validated_data['level'],
				winner=validated_data['winner']
			)
			try:
				serializer.save()
				return Response({"message": "create game data successfully"}, status=status.HTTP_200_OK)
			except Exception as e:
				return Response({"message": "failed to register game data"}, status=status.HTTP_400_BAD_REQUEST)
		
			# return game


