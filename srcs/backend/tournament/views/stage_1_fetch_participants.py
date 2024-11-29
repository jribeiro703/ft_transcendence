# GET /tournament/players/

from rest_framework.views import APIView
from rest_framework.response import Response
from user.models import User
import logging

logger = logging.getLogger(__name__)

class FetchParticipantsView(APIView):
	"""
	Fetch all users for pre-registration in a tournament.
	"""
	def get(self, request):
		try:
			users = User.objects.all()
			if not users.exists():
				return Response({"message": "No users found."}, status=404)
			
			participants = [{"id": user.id, "username": user.username} for user in users]
			return Response(participants, status=200)
		except Exception as e:
			logger.error(f"Error fetching participants: {e}")
			return Response({"error": f"Failed to fetch participants: {str(e)}"}, status=500)
