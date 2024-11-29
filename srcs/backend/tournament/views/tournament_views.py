# tournament_views.py
# Who am I?
# This file contains the views for managing tournaments.
# It includes endpoints for creating tournaments, adding players to tournaments,
# and checking the progress of tournaments.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Tournament, Game
from user.models import User
from .serializers import TournamentSerializer

# ❶ TOURNAMENT CREATTION STAGE - Create Tournament
class CreateTournamentView(APIView):
	"""
	Endpoint to create a new tournament.

	Flow:
	1. Receive a POST request with tournament data.
	2. Validate the data using TournamentSerializer.
	3. If valid, save the tournament to the database.
	4. Return the tournament ID and status in the response.
	5. If invalid, return validation errors.

	**Stage 1: Tournament Creation**
	- Status: UPCOMING
	- Players: None
	- Games: None
	"""
	def post(self, request):
		try:
			# Validate the incoming data
			serializer = TournamentSerializer(data=request.data)
			if serializer.is_valid():
				# Save the tournament to the database
				default_user = User.objects.first()  # Replace with the authenticated user
				tournament = serializer.save(created_by=default_user)
				# Return the tournament ID and status
				return Response({
					"tournament_id": tournament.id,
					"status": tournament.status
				}, status=status.HTTP_201_CREATED)
			# Return validation errors
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			# Log the error for debugging
			print(f"Error creating tournament: {e}")
			# Return a generic error response
			return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ❶ TOURNAMENT CREATTION STAGE - Add Players to Tournament
class AddPlayersToTournamentView(APIView):
	"""
	Endpoint to add players to an existing tournament.

	Flow:
	1. Receive a POST request with tournament ID and player IDs.
	2. Find the tournament and players in the database.
	3. Add the players to the tournament.
	4. Return a success response.
	5. If the tournament or players are not found, return an error response.

	**Stage 2: Player Registration**
	- Status: UPCOMING
	- Players: Added
	- Games: None
	"""
	def post(self, request, tournament_id):
		try:
			# Find the tournament by ID
			tournament = Tournament.objects.get(id=tournament_id)
			# Get the list of player IDs from the request
			player_ids = request.data.get('players', [])
			# Find the players by IDs
			players = User.objects.filter(id__in=player_ids)
			# Add the players to the tournament
			tournament.players.add(*players)
			# Return a success response
			return Response({"success": True}, status=status.HTTP_200_OK)
		except Tournament.DoesNotExist:
			# Return an error response if the tournament is not found
			return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			# Return an error response for other exceptions
			return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ❹ TOURNAMENT PROGRES STAGE - Fetch Tournament Progress
class TournamentProgressView(APIView):
	"""
	Endpoint to fetch the progress of a tournament.

	Flow:
	1. Receive a GET request with the tournament ID.
	2. Find the tournament in the database.
	3. Calculate the number of completed, ongoing games, and remaining players.
	4. Return the progress details in the response.
	5. If the tournament is not found, return an error response.

	**Stage 3: Tournament Progress**
	- Status: ONGOING
	- Players: Participating
	- Games: In progress
	"""
	def get(self, request, tournament_id):
		try:
			# Find the tournament by ID
			tournament = Tournament.objects.get(id=tournament_id)
			# Get all games related to the tournament
			games = tournament.games.all()
			# Filter completed and ongoing games
			completed_games = games.filter(status='COMPLETED')
			ongoing_games = games.filter(status='ONGOING')
			# Count the remaining players
			remaining_players = tournament.players.count()
			# Return the progress details
			return Response({
				"games_completed": completed_games.count(),
				"games_ongoing": ongoing_games.count(),
				"players_remaining": remaining_players,
				"leaderboard": []  # Placeholder for leaderboard logic
			}, status=status.HTTP_200_OK)
		except Tournament.DoesNotExist:
			# Return an error response if the tournament is not found
			return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)

# ❺ WINNER ANNOUNCEMENT STAGE - Tournament Winner Announcement view
class TournamentAnnouncementView(APIView):
	"""
	Endpoint to announce the winner of the tournament.

	Flow:
	1. Receive a POST request with the tournament ID and winner ID.
	2. Find the tournament and winner in the database.
	3. Update the tournament with the winner.
	4. Return a success response.
	5. If the tournament or winner is not found, return an error response.

	**Stage 5: Tournament Completion**
	- Status: COMPLETED
	- Players: Winner declared
	- Games: All completed
	"""
	def post(self, request, tournament_id):
		try:
			# Find the tournament by ID
			tournament = Tournament.objects.get(id=tournament_id)
			# Get the winner ID from the request
			winner_id = request.data.get('winner_id')
			# Find the winner by ID
			winner = User.objects.get(id=winner_id)
			# Update the tournament with the winner
			tournament.winner = winner
			tournament.status = 'COMPLETED'
			tournament.save()
			# Return a success response
			return Response({"success": True}, status=status.HTTP_200_OK)
		except Tournament.DoesNotExist:
			# Return an error response if the tournament is not found
			return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)
		except User.DoesNotExist:
			# Return an error response if the winner is not found
			return Response({"error": "Winner not found"}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			# Return an error response for other exceptions
			return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
