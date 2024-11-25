# stage 2_matchmaking_pairing.py
# This file contains the views for fetching the list of user and registering them as players.

from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Tournament
from user.models import User
from user.serializers import UserSerializer

class FetchPlayersView(ListAPIView):
	"""
	Endpoint to fetch the list of available players.

	Flow:
	1. Receive a GET request.
	2. Query the database for all users (players).
	3. Serialize the data using UserSerializer.
	4. Return the list of players in the response.
	"""
	queryset = User.objects.all()
	serializer_class = UserSerializer

class AddPlayersToTournamentView(APIView):
	"""
	Endpoint to add players to an existing tournament.

	Flow:
	1. Receive a POST request with tournament ID and player IDs.
	2. Find the tournament and players in the database.
	3. Add the players to the tournament.
	4. Return a success response.
	5. If the tournament or players are not found, return an error response.

	**Player Registration**
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
