# POST /tournament/
# This file contains the view for creating a new tournament.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.apps import apps
from django.db import IntegrityError
from rest_framework.permissions import IsAuthenticated

from user.models import User

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
			# Log the incoming data
			print('Incoming data:', request.data)

			# Validate the incoming data
			serializer = TournamentSerializer(data=request.data)
			if serializer.is_valid():
				# Save the tournament to the database
				default_user = User.objects.first()  # TODO: Replace with the authenticated user
				tournament = serializer.save(created_by=default_user)
				# Return the tournament ID and status
				return Response({
					"tournament_id": tournament.id,
					"status": tournament.status,
					"name": tournament.name
				}, status=status.HTTP_201_CREATED)
			# Return validation errors
			print('Validation errors:', serializer.errors)  # Log the validation errors
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		except IntegrityError as e:
			# Handle unique constraint violation
			print(f"Error creating tournament: {e}")
			return Response({"error": "Tournament name must be unique."}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			# Log the error for debugging
			print(f"Error creating tournament: {e}")
			# Return a generic error response
			return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# ❶ TOURNAMENT CREATTION STAGE - Pre-register Players for a tournament
class PreRegisterPlayersView(APIView):
	"""
	Associates eligible players with a tournament.
	"""
	def post(self, request):
		try:
			# Extract data from the request
			tournament_id = request.data.get('tournament_id')
			player_ids = request.data.get('player_ids')

			if not tournament_id or not player_ids:
				return Response({'message': 'Tournament ID and Player IDs are required.'}, status=400)

			# Fetch models
			Tournament = apps.get_model('tournament', 'Tournament')
			User = apps.get_model('user', 'User')

			# Validate the tournament
			try:
				tournament = Tournament.objects.get(id=tournament_id)
			except Tournament.DoesNotExist:
				return Response({'message': 'Tournament not found.'}, status=404)

			# Fetch valid players
			players = User.objects.filter(id__in=player_ids)
			if not players.exists():
				return Response({'message': 'No valid players found.'}, status=404)

			# Add players to the tournament
			tournament.players.add(*players)

			return Response({
				'message': 'Players added successfully.',
				'tournament_id': tournament.id,
				'player_count': players.count(),
				'players': [{'id': player.id, 'username': player.username} for player in players]
			}, status=200)

		except Exception as e:
			logger.error(f"Error pre-registering players: {e}")
			return Response({'error': f'Failed to add players: {str(e)}'}, status=500)
