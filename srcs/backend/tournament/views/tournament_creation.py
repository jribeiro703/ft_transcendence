# stage 1_tournament_creation.py
# This file contains the view for creating a new tournament.

# https://stackoverflow.com/questions/31816624/naming-convention-for-django-url-templates-models-and-views

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from user.models import User
from user.serializers import UserSerializer

from tournament.models import Tournament
from tournament.serializers import TournamentSerializer


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
				default_user = User.objects.first()  # TODO: Replace with the authenticated user
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


# ❶ TOURNAMENT CREATTION STAGE - Fetch Players List
# https://www.django-rest-framework.org/api-guide/generic-views/
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
