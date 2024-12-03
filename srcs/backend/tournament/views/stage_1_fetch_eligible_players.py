from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from user.models import User
import logging

logger = logging.getLogger(__name__)

class FetchEligiblePlayersView(APIView):
	def get(self, request):
		try:
			logger.debug("Attempting to fetch eligible players.")
			#eligible_players = User.objects.filter(is_online=True)
			eligible_players = User.objects.all()
			logger.debug(f"Found players: {eligible_players}")

			if not eligible_players.exists():
				logger.debug("No eligible players found.")
				return Response({"message": "No eligible players found."}, status=404)

			players_data = [
				{"id": user.id, "username": user.username} for user in eligible_players
			]
			return Response({"eligible_players": players_data}, status=200)

		except Exception as e:
			logger.error(f"Error fetching eligible players: {e}")
			return JsonResponse({"error": "Internal server error"}, status=500)
