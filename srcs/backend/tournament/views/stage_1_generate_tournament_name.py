from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random

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
		name = generate_tournament_name()
		return Response({"name": name}, status=status.HTTP_200_OK)

class ValidateTournamentNameView(APIView):
	"""
	Endpoint to validate a tournament name.
	"""
	def post(self, request):
		name = request.data.get('name')
		is_valid = valid_name(name)
		return Response({"isValid": is_valid}, status=status.HTTP_200_OK)
