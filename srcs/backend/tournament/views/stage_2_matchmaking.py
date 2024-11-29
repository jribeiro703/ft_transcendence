from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.apps import apps
from random import shuffle
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PerformMatchmakingView(APIView):
	"""
	Endpoint to perform matchmaking and generate games.
	"""
	def post(self, request):
		try:
			# Extract tournament ID from the request
			tournament_id = request.data.get('tournament_id')
			if not tournament_id:
				return Response({'message': 'Tournament ID is required.'}, status=400)

			# Fetch models
			Tournament = apps.get_model('tournament', 'Tournament')
			Game = apps.get_model('game', 'Game')

			# Validate the tournament
			try:
				tournament = Tournament.objects.get(id=tournament_id)
			except Tournament.DoesNotExist:
				return Response({'message': 'Tournament not found.'}, status=404)

			# Fetch associated players
			players = list(tournament.players.all())  # List for shuffling
			if len(players) < 2:
				return Response({'message': 'Not enough players for matchmaking.'}, status=400)

			# Shuffle players for random matchmaking
			shuffle(players)
			bracket = []

			# Create games for player pairs
			for i in range(0, len(players), 2):
				player1 = players[i]
				player2 = players[i + 1] if i + 1 < len(players) else None

				if player2:
					game = Game.objects.create(
						player_one=player1,
						player_two=player2,
						tournament=tournament,
						max_score=tournament.max_score,
						status='NOT_STARTED',
					)
					tournament.games.add(game)
					bracket.append({"player1": player1.username, "player2": player2.username})
				else:
					bracket.append({"player1": player1.username, "player2": 'BYE'})

			return Response({"matches": bracket}, status=200)

		except Exception as e:
			logger.error(f"Error performing matchmaking: {e}")
			return Response({'error': f'Failed to perform matchmaking: {str(e)}'}, status=500)
