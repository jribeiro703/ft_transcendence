from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.db import models
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils.translation import gettext as _
from django.db.models import Q
from django.http import JsonResponse

import json
import random

from django.apps import apps
from django.db import IntegrityError
from django.shortcuts import get_object_or_404

from user.models import User
from tournament.models import Tournament, Guest, TournamentMatch
from game.models import Game

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from django.db import transaction
from tournament.models import Tournament, TournamentMatch, Guest
from game.models import Game
from user.models import User
import random
import logging

logger = logging.getLogger(__name__)

class CreateTournamentView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		try:
			logger.info(f"Request user: {request.user}, Authenticated: {request.user.is_authenticated}")
			players = request.data.get('players', [])
			logger.info(f"Players: {players}")

			if len(players) != 4:
				return Response({'error': 'Invalid number of players. Must provide exactly 4 players.'}, status=HTTP_400_BAD_REQUEST)

			difficulty = "EASY"  # Default difficulty

			player_objects = []
			for player in players:
				user_id = player.get('user_id')
				guest_name = player.get('guest_name')

				if user_id:
					try:
						user = User.objects.get(id=user_id)
						player_objects.append((user, None))
					except User.DoesNotExist:
						return Response({'error': f'User with id {user_id} does not exist.'}, status=HTTP_400_BAD_REQUEST)
				elif guest_name:
					guest, created = Guest.objects.get_or_create(display_name=guest_name)
					player_objects.append((None, guest))
				else:
					return Response({'error': 'Invalid player entry. Each player must have either a user_id or guest_name.'}, status=HTTP_400_BAD_REQUEST)

			random.shuffle(player_objects)

			with transaction.atomic():
				# Create Tournament
				tournament = Tournament.objects.create(
					created_by=request.user,
					status="open",
					player_count=len(player_objects),
					current_match=1
				)

				# Register users
				registered_users = [player[0] for player in player_objects if player[0]]
				for user in registered_users:
					tournament.registered_users.add(user)

				first_game_id = None
				# Create Matches
				for i in range(2):  # First two matches
					player1, guest1 = player_objects[2 * i]
					player2, guest2 = player_objects[2 * i + 1]

					game = Game.objects.create(
						difficulty=difficulty,
						tournament=tournament,
						player_one=player1,
						player1_guest=guest1,
						player_two=player2,
						player2_guest=guest2,
						score_one=0,
						score_two=0,
					)
					game.save()
					logger.info(f"Created Game with id: {game.id}")

					if first_game_id is None:
						first_game_id = game.id  # Capture the first game's ID

					TournamentMatch.objects.create(
						tournament=tournament,
						match=game,
						position=i + 1,
						player1_name=game.get_player1_name(),
						player2_name=game.get_player2_name(),
					)
					tournament.save()
					tournament.current_match = first_game_id

				# Create Final Match
				final_game = Game.objects.create(
					difficulty=difficulty,
					tournament=tournament,
					score_one=0,
					score_two=0,
				)
				final_game.save()

				TournamentMatch.objects.create(
					tournament=tournament,
					match=final_game,
					position=3,
					player1_name="TBD",
					player2_name="TBD",
				)
				tournament.save()

			return Response({'success': 'Tournament created', 'tournament_id': tournament.id}, status=HTTP_201_CREATED)

		except Exception as e:
			logger.error(f"Error creating tournament: {str(e)}")
			return Response({'error': 'An error occurred while creating the tournament.'}, status=HTTP_400_BAD_REQUEST)

class TournamentDetailView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, tournament_id):
		logger.info("TournamentDetailView GET method called")

		logger.info(f"Received tournament_id: {tournament_id}")
		try:
			tournament = Tournament.objects.get(id=tournament_id)
			logger.info(f"Tournament details: {tournament}")
			matches = TournamentMatch.objects.filter(tournament=tournament).order_by('position')
			matches_info = []

			for match in matches:
				matches_info.append({
					'match_id': match.match.id,
					'position': match.position,
					'player1': match.player1_name,
					'player2': match.player2_name,
					'score_one': match.match.score_one,
					'score_two': match.match.score_two,
				})

			data = {
				"id": tournament.id,
				"created_by": tournament.created_by.username,
				"status": tournament.status,
				"player_count": tournament.player_count,
				"current_match": tournament.current_match,
				"matches": matches_info,				
			}
			return Response(data, status=200)
		except Tournament.DoesNotExist:
			return Response({"error": "Tournament not found"}, status=404)

		except Tournament.DoesNotExist:
			return Response({"error": "Tournament not found"}, status=404)

@csrf_exempt
def go_to_tournament_next_match(request, tournament_id):
	if request.method == 'POST':
		logger.info(f"Received tournament_id: {tournament_id}")
		logger.info(f"Raw POST body: {request.body}")
		max_nb_matches = 3
		# Parse JSON data from the request body
		data = json.loads(request.body.decode('utf-8'))
		logger.info(f"Received JSON data: {data}")
		try:
			match_id = data.get('matchId')
			logger.info(f"Match ID: {match_id}")
		except json.JSONDecodeError as e:
			logger.error(f"Failed to parse JSON: {e}")
			return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

		if not match_id:
			logger.error("No match ID provided in the request.")
			return JsonResponse({'error': 'Match ID is required'}, status=400)
		score_one = data.get('score_one')
		score_two = data.get('score_two')
		try:
			tournament = Tournament.objects.get(id=tournament_id)
			logger.info(f"Received match_id: {match_id}")
			try:
				match = Game.objects.get(id=match_id)
			except Game.DoesNotExist:
				logger.error(f"Game with id {match_id} does not exist.")
				return JsonResponse({'error': f'Game with id {match_id} not found'}, status=404)
			
			if score_one is None or score_two is None:
				logger.error("Scores are required to update the match.")
				return JsonResponse({'error': 'Scores are required'}, status=400)

			match.score_one = score_one
			match.score_two = score_two
			match.status = 'finished'
			match.save()

			# Get the winner User of the match
			if match.score_one > match.score_two:
				winner_user = match.player_one
				winner_guest = match.player1_guest
				winner = match.player_one.username if match.player_one else match.player1_guest.display_name
			else:
				winner_user = match.player_two
				winner_guest = match.player2_guest
				winner = match.player_two.username if match.player_two else match.player2_guest.display_name

			# Get all tournament matches
			tournamentMatches = TournamentMatch.objects.filter(tournament=tournament).order_by('position')
			next_match = None
			for tournamentMatch in tournamentMatches:
				if tournamentMatch.player1_name == "TBD":
					tournamentMatch.player1_name = winner
					tournamentMatch.save()
					next_match = Game.objects.get(id=tournamentMatch.match.id)
					next_match.player_one = winner_user
					next_match.player1_guest = winner_guest
					next_match.save()
					break
				if tournamentMatch.player2_name == "TBD":
					tournamentMatch.player2_name = winner
					tournamentMatch.save()
					next_match = Game.objects.get(id=tournamentMatch.match.id)
					next_match.player_two = winner_user
					next_match.player2_guest = winner_guest
					next_match.save()
					break

			if not next_match:
				tournament.status = 'finished'
				tournament.winner = winner
				tournament.current_match = 0
				tournament.save()
				return JsonResponse({'success': 'Tournament finished'}, status=200)
			else:
				tournament.current_match += 1
				tournament.save()
				return JsonResponse({'success': 'Next match launched'}, status=200)
		except Tournament.DoesNotExist:
			return JsonResponse({'error': 'Tournament not found'}, status=404)
		except Exception as e:
			logger.error(f"Error in go_to_tournament_next_match: {e}")
			return JsonResponse({'error': 'Failed to launch next match'}, status=500)
	return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required
def tournament_list(request):
	tournaments = Tournament.objects.filter(Q(registered_users=request.user) | 
											Q(created_by=request.user)).distinct()
	tournament_list = []
	for tournament in tournaments:
		nb_matches = 3 if tournament.player_count == 4 else 7
		if tournament.current_match == 0:
			current_stage = _('Finished')
		elif tournament.current_match == nb_matches:
			current_stage = _('Final')
		else:
			if nb_matches == 3:
				current_stage = _('Semifinals')
			else:
				current_stage = _('Quarterfinals') if tournament.current_match < 4 else _('Semifinals')

		# Get current match in tournament match
		current_match = None
		if tournament.current_match > 0:
			current_match = TournamentMatch.objects.get(tournament=tournament, position=tournament.current_match)

		item = {
			'id': tournament.id,
			'name': tournament.created_by.username + _("'s tournament"),
			'current_stage': current_stage,
			'current_match': f'{current_match.player1_name} VS {current_match.player2_name}' if current_match else f'🏆: {tournament.winner}',
			'was_created_by_me': tournament.created_by == request.user
		}

		tournament_list.append(item)
	return JsonResponse({'tournaments': tournament_list}, status=200)

class DeleteTournamentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
            if tournament.created_by == request.user:
                tournament.delete()
                return Response({'success': 'Tournament deleted'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        except Tournament.DoesNotExist:
            return Response({'error': 'Tournament not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error deleting tournament: {e}")
            return Response({'error': 'An error occurred while deleting the tournament.'}, status=status.HTTP_400_BAD_REQUEST)

class UserOngoingTournamentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Query for the user's ongoing tournament
            ongoing_tournament = Tournament.objects.filter(
                created_by=request.user, status="open"
            ).order_by("-created_at").first()

            if not ongoing_tournament:
                return Response({"message": "No ongoing tournament found."}, status=404)

            matches = TournamentMatch.objects.filter(tournament=ongoing_tournament).order_by('position')
            matches_info = [
                {
                    'match_id': match.match.id,
                    'position': match.position,
                    'player1': match.player1_name,
                    'player2': match.player2_name,
                    'score_one': match.match.score_one,
                    'score_two': match.match.score_two,
                } for match in matches
            ]

            data = {
                "id": ongoing_tournament.id,
                "created_by": ongoing_tournament.created_by.username,
                "status": ongoing_tournament.status,
                "player_count": ongoing_tournament.player_count,
                "current_match": ongoing_tournament.current_match,
                "matches": matches_info,
            }
            return Response(data, status=200)
        except Exception as e:
            logger.error(f"Error fetching ongoing tournament: {e}")
            return Response({"error": "Failed to fetch ongoing tournament."}, status=500)
