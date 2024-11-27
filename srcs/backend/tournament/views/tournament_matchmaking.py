from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.apps import apps
from django.contrib.auth import get_user_model
from random import shuffle, choice, randint
import logging

logger = logging.getLogger(__name__)

class PerformMatchmakingView(APIView):
	"""
	Endpoint to perform random matchmaking and return the bracket.
	"""
	def post(self, request, *args, **kwargs):
		try:
			# Get the tournament ID from the request data
			tournament_id = request.data.get('tournament_id')
			if not tournament_id:
				return Response({'message': 'Tournament ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

			# Dynamically get the Game and Tournament models
			Game = apps.get_model('game', 'Game')
			Tournament = apps.get_model('tournament', 'Tournament')
			User = get_user_model()

			# Fetch the tournament by ID
			tournament = Tournament.objects.get(id=tournament_id)
			logger.debug(f"Fetched tournament: {tournament}")

			# Fetch all users from the User table
			users = list(User.objects.all())
			logger.debug(f"Fetched users: {users}")

			if len(users) < 2:
				return Response({'message': 'Not enough users to create matches.'}, status=status.HTTP_400_BAD_REQUEST)

			# Randomize the order of users
			shuffle(users)
			logger.debug(f"Shuffled users: {users}")

			bracket = []
			# Create matches for each pair of players
			for i in range(0, len(users), 2):
				player1 = users[i]
				player2 = users[i + 1] if i + 1 < len(users) else None
				if player2:
					bracket.append({"player1": player1.username, "player2": player2.username})
					# Create a demo game for the match
					demo_game = Game.objects.create(
						player_one=player1,
						player_two=player2,
						score_one=randint(0, 10),
						score_two=randint(0, 10),
						tournament=tournament,  # Set the tournament field
						created_at="2024-11-26T14:17:03Z"
					)
					logger.debug(f"Created game: {demo_game}")
					tournament.games.add(demo_game)  # Add the game to the tournament
				else:
					bracket.append({"player1": player1.username, "player2": 'BYE'})

			return Response({"matches": bracket}, status=status.HTTP_200_OK)
		except Tournament.DoesNotExist:
			return Response({'message': 'Tournament not found.'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			logger.error(f"Error performing matchmaking: {e}")
			return Response({'error': f'Failed to perform matchmaking: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
