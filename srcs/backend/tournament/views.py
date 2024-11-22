from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from .models import Tournament
from user.models import User
from .serializers import TournamentSerializer
from user.serializers import UserSerializer  # Assuming this serializer exists

class CreateTournamentView(APIView):
	"""
	Endpoint to create a new tournament.
	"""
	def post(self, request):
		try:
			serializer = TournamentSerializer(data=request.data)
			if serializer.is_valid():
				#tournament = serializer.save(created_by=request.user)
				default_user = User.objects.first()  # Replace with the authenticated user
				tournament = serializer.save(created_by=default_user)
				return Response({
					"tournament_id": tournament.id,
					"status": tournament.status
				}, status=status.HTTP_201_CREATED)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
					# Log the error for debugging
					print(f"Error creating tournament: {e}")
					return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PlayerListView(ListAPIView):
	"""
	Endpoint to fetch the list of available players.
	"""
	queryset = User.objects.all()
	serializer_class = UserSerializer


class AddPlayersToTournamentView(APIView):
	"""
	Endpoint to add players to an existing tournament.
	"""
	def post(self, request, tournament_id):
		try:
			tournament = Tournament.objects.get(id=tournament_id)
			player_ids = request.data.get('players', [])
			players = User.objects.filter(id__in=player_ids)

			tournament.players.add(*players)
			return Response({"success": True}, status=status.HTTP_200_OK)
		except Tournament.DoesNotExist:
			return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TournamentProgressView(APIView):
	"""
	Endpoint to fetch the progress of a tournament.
	"""
	def get(self, request, tournament_id):
		try:
			tournament = Tournament.objects.get(id=tournament_id)
			games = tournament.games.all()
			completed_games = games.filter(status='COMPLETED')
			ongoing_games = games.filter(status='ONGOING')
			remaining_players = tournament.players.count()

			return Response({
				"games_completed": completed_games.count(),
				"games_ongoing": ongoing_games.count(),
				"players_remaining": remaining_players,
				"leaderboard": []  # Placeholder for leaderboard logic
			}, status=status.HTTP_200_OK)
		except Tournament.DoesNotExist:
			return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)
