from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.apps import apps
from django.contrib.auth import get_user_model
from random import choice, randint
import logging

logger = logging.getLogger(__name__)

class PerformMatchmakingView(APIView):
	"""
	Endpoint to perform random matchmaking and return the bracket.
	"""
	def post(self, request, *args, **kwargs):
		try:
			# Dynamically get the Game model
			Game = apps.get_model('game', 'Game')
			User = get_user_model()

			# Fetch all usernames from the User table
			users = list(User.objects.all())

			if len(users) < 2:
				return Response({'message': 'Not enough users to create a demo game.'}, status=status.HTTP_400_BAD_REQUEST)

			random_players = [choice(users), choice(users)]
			demo_game = Game.objects.create(
				player_one=random_players[0],
				player_two=random_players[1],
				score_one=randint(0, 10),
				score_two=randint(0, 10),
				created_at="2024-11-21T12:00:00Z"
			)

			return Response({
				'game': {
					'player_one': demo_game.player_one.id if demo_game.player_one else None,
					'player_two': demo_game.player_two.id if demo_game.player_two else None,
					'score_one': demo_game.score_one,
					'score_two': demo_game.score_two,
				}
			}, status=status.HTTP_200_OK)
		except Exception as e:
			logger.error(f"Error creating demo game: {e}")
			return Response({'error': f'Failed to create demo game: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
