# stage_5_tournament_announcement.py
# Who am I?
# This file contains the view for announcing the winner of a tournament.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from tournament.models import Tournament
from user.models import User

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
