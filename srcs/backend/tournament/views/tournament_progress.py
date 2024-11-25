# stage 4_tournament_progress.py
# This file contains the view for fetching the progress of a tournament.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Tournament, Game

class TournamentProgressView(APIView):
	"""
	Endpoint to fetch the progress of a tournament.

	Flow:
	1. Receive a GET request with the tournament ID.
	2. Find the tournament in the database.
	3. Calculate the number of completed, ongoing games, and remaining players.
	4. Return the progress details in the response.
	5. If the tournament is not found, return an error response.

	**Stage 4: Tournament Progress**
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
