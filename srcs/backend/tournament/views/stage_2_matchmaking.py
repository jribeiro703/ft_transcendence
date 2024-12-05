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
	Endpoint to perform random matchmaking and create games and game players.
	"""
	def post(self, request):
		try:
			# Extract tournament ID from request
			tournament_id = request.data.get('tournament_id')
			if not tournament_id:
				return Response({'message': 'Tournament ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

			# Fetch models dynamically
			Tournament = apps.get_model('tournament', 'Tournament')
			Game = apps.get_model('game', 'Game')
			GamePlayer = apps.get_model('game', 'GamePlayer')

			# Fetch the tournament instance
			try:
				tournament = Tournament.objects.prefetch_related('players').get(id=tournament_id)
			except Tournament.DoesNotExist:
				return Response({'message': 'Tournament not found.'}, status=status.HTTP_404_NOT_FOUND)

			# Fetch players and ensure they are User objects
			players = list(tournament.players.all())
			if len(players) < 2:
				return Response({'message': 'Not enough players for matchmaking.'}, status=status.HTTP_400_BAD_REQUEST)

			# Shuffle players for random matchmaking
			shuffle(players)
			bracket = []

			# Create games and game players for each pair
			for i in range(0, len(players), 2):
				player1 = players[i]
				player2 = players[i + 1] if i + 1 < len(players) else None

				if player2:
					# Create a game instance
					game = Game.objects.create(
						player_one=player1,
						player_two=player2,
						tournament=tournament,
						max_score=tournament.max_score,
						status='NOT_STARTED',
					)
					tournament.games.add(game)

					# Create GamePlayer entries
					GamePlayer.objects.create(game=game, user=player1, status='READY')
					GamePlayer.objects.create(game=game, user=player2, status='READY')

					# Add match to bracket
					bracket.append({"player1": player1.username, "player2": player2.username})
				else:
					# Handle a BYE round
					bracket.append({"player1": player1.username, "player2": 'BYE'})

			# Return the match bracket
			return Response({"matches": bracket}, status=status.HTTP_200_OK)

		except Exception as e:
			logger.error(f"Error performing matchmaking: {e}")
			return Response({'error': f'Failed to perform matchmaking: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TournamentBracketView(APIView):
	def get(self, request, tournament_id):
		try:
			Tournament = apps.get_model('tournament', 'Tournament')
			Game = apps.get_model('game', 'Game')
			User = apps.get_model('user', 'User')

			tournament = Tournament.objects.get(id=tournament_id)
			games = tournament.games.all()

			bracket = []
			for game in games:
				player1 = User.objects.get(id=game.player_one.id)
				player2 = User.objects.get(id=game.player_two.id) if game.player_two else 'BYE'
				bracket.append({
					"player1": player1.username,
					"player2": player2.username if player2 != 'BYE' else player2
				})

			return Response({'bracket': bracket}, status=status.HTTP_200_OK)
		except Tournament.DoesNotExist:
			return Response({'error': 'Tournament not found.'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			logger.error(f"Error fetching tournament bracket: {e}")
			return Response({'error': f'Failed to fetch tournament bracket: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CurrentPlayersView(APIView):
	def get(self, request, tournament_id):
		try:
			Tournament = apps.get_model('tournament', 'Tournament')

			tournament = Tournament.objects.get(id=tournament_id)
			players = tournament.players.all()
			player_list = [{'id': player.id, 'username': player.username} for player in players]
			return Response({'players': player_list}, status=status.HTTP_200_OK)
		except Tournament.DoesNotExist:
			return Response({'error': 'Tournament not found.'}, status=status.HTTP_404_NOT_FOUND)
