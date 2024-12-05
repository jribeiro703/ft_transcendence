from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random

from tournament.models import Tournament

# Lists of words to combine
adjectives = [
	"Mighty", "Epic", "Legendary", "Ultimate", "Supreme", "Dynamic", "Fierce",
	"Heroic", "Majestic", "Radiant", "Vibrant", "Elite", "Prestigious", "Iconic"
]

nouns = [
	"Challenge", "Showdown", "Clash", "Duel", "Battle", "Contest", "Face-off",
	"Rumble", "Brawl", "Tourney", "Gauntlet", "Melee", "Skirmish", "Conquest"
]

# Function to generate a random tournament name
def generate_tournament_name():
	adjective = random.choice(adjectives)
	noun = random.choice(nouns)
	return f"{adjective} {noun}"

# Ensure the name is between 3 and 30 characters
def valid_name(name):
	return 3 <= len(name) <= 30

class GenerateTournamentNameView(APIView):
	"""
	Endpoint to generate a random tournament name.
	"""
	def get(self, request):
		print("GenerateTournamentNameView: GET request received")
		while True:
			name = generate_tournament_name()
	#		user = request.user  # Get the authenticated user #TODO: After real auth
	#		if user.is_authenticat	ed:
	#			username = user.username
			username = "Latha" # Dummy Impl
			if (username):
				full_name = f"{name} by {username}"
			else:
				full_name = name
			if valid_name(name) and not Tournament.objects.filter(name=name).exists():
				print(f"GenerateTournamentNameView: Generated name - {full_name}")
				return Response({"name": full_name}, status=status.HTTP_200_OK)

class ValidateTournamentNameView(APIView):
	"""
	Endpoint to validate a tournament name.
	"""
	def post(self, request):
		print("request.data", request.data)
		print("ValidateTournamentNameView: POST request received")
		name = request.data.get('name')
		print(f"ValidateTournamentNameView: Validating name - {name}")
		is_valid = valid_name(name)
		print(f"ValidateTournamentNameView: Name is valid - {is_valid}")
		return Response({"isValid": is_valid}, status=status.HTTP_200_OK)
