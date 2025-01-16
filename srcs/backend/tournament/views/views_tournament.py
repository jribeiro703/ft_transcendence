from django.db import models
from user.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils.translation import gettext as _
from django.db.models import Q
from django.http import JsonResponse
from tournament.models import Tournament, TournamentMatch, Guest
from game.models import Game
import json
import random

#used
@csrf_exempt
@login_required
def create_tournament(request):
	if request.method == 'POST':
		request_user = request.user
	
		# Fixed number of players and matches for a simplified tournament
		nb_players = 4
		nb_matches = 3
		difficulty = "EASY"  # Default difficulty

		players = []
		for i in range(1, nb_players + 1):
			user_key = f'player{i}_user'
			guest_key = f'player{i}_guest'
			user_id = request.POST.get(user_key)
			guest_name = request.POST.get(guest_key)

			if user_id:
				try:
					user = User.objects.get(id=user_id)
					players.append((user, None))
				except User.DoesNotExist:
					return JsonResponse({'error': f'User with id {user_id} does not exist'}, status=400)
			elif guest_name:
				guest, created = Guest.objects.get_or_create(display_name=guest_name)
				players.append((None, guest))
			else:
				#break
				return JsonResponse({'error': 'Invalid players. Must provide exactly 4 players.'}, status=400)

		if len(players) != nb_players:
			return JsonResponse({'error': 'Invalid number of players. Must be exactly 4.'}, status=400)
		
		# Shuffle the players
		random.shuffle(players)

		# Create the Tournament
		tournament = Tournament(
			created_by=request_user,
			status="open",
			player_count=nb_players,
			current_match=1
		)
		tournament.save()

		# Get all registered users from players list
		registered_users = [player[0] for player in players if player[0]]
		for user in registered_users:
			tournament.registered_users.add(user)
			tournament.save()


		# Create the 2 initial matches
		initial_matches = nb_players // 2 # in case of 4 players, 2 initial matches
		for i in range(2):
			player1, guest1 = players[2 * i]
			player2, guest2 = players[2 * i + 1]

			game = Game(
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

			tournament_match = TournamentMatch(
				tournament=tournament,
				game=Game,
				position=i + 1,
				player1_name=game.get_player1_name(),
                player2_name=game.get_player2_name(),
			)
			tournament_match.save()

		# Create subsequent matches without players
		# this loop is unnecessary, as the number of matches is fixed, this will always be 1, the final match
		for i in range(initial_matches, nb_matches): 
			game = Game(
				difficulty=difficulty,
				tournament=tournament,
				score_one=0,
            	score_two=0,
			)
			game.save()

			tournament_match = TournamentMatch(
				tournament=tournament,
				game=Game,
				position=i + 1, # this will always be 3, the final match
				player1_name="TBD",
            	player2_name="TBD",
			)
			tournament_match.save()

		return JsonResponse({'success': 'Tournament created', 'tournament_id': tournament.id}, status=200)
	return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
@login_required
def get_tournament_info(request):
	if request.method == 'POST':
		tournament_id = request.POST.get('tournamentId')
		tournament = Tournament.objects.get(id=tournament_id)

		matches = TournamentMatch.objects.filter(tournament=tournament).order_by('position')
		matches_info = []
		for match in matches:
			match_info = {
				'match_id': match.match.id,
				'position': match.position,
				'player1': match.player1_name,
				'player2': match.player2_name,
				'score_player1': match.match.score_player1,
				'score_player2': match.match.score_player2
			}
			matches_info.append(match_info)

		current_match = matches.filter(position=tournament.current_match).first()
		if current_match:
			current_match = {
				'match_id': current_match.match.id,
				'position': current_match.position,
				'player1': current_match.player1_name,
				'player2': current_match.player2_name,
				'score_player1': current_match.match.score_player1,
				'score_player2': current_match.match.score_player2
			}

		registered_users = tournament.registered_users.all()

		return JsonResponse({
			'tournament_id': tournament.id,
			'status': tournament.status,
			'player_count': tournament.player_count,
			'current_match': current_match,
			'winner': tournament.winner,
			'matches': matches_info,
			'registered_users': [user.display_name for user in registered_users]
		}, status=200)
	return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
@login_required
def go_to_tournament_next_match(request, tournament_id):
	if request.method == 'POST':
		tournament = Tournament.objects.get(id=tournament_id)
		max_nb_matches = 3 if tournament.player_count == 4 else 7

		match_id = request.POST.get('matchId')
		match = Match.objects.get(id=match_id)
		match.score_player1 = request.POST.get('score_player1')
		match.score_player2 = request.POST.get('score_player2')
		match.status = 'finished'
		match.save()

		# Get the winner User of the match
		if match.score_player1 > match.score_player2:
			winner_user = match.player1_user
			winner_guest = match.player1_guest
			winner = match.player1_user.display_name if match.player1_user else match.player1_guest.display_name
		else:
			winner_user = match.player2_user
			winner_guest = match.player2_guest
			winner = match.player2_user.display_name if match.player2_user else match.player2_guest.display_name

		# Get all tournament matches
		tournamentMatches = TournamentMatch.objects.filter(tournament=tournament).order_by('position')
		next_match = None
		for tournamentMatch in tournamentMatches:
			if tournamentMatch.player1_name == "TBD":
				tournamentMatch.player1_name = winner
				tournamentMatch.save()
				next_match = Match.objects.get(id=tournamentMatch.match.id)
				next_match.player1_user = winner_user
				next_match.player1_guest = winner_guest
				next_match.save()
				break
			if tournamentMatch.player2_name == "TBD":
				tournamentMatch.player2_name = winner
				tournamentMatch.save()
				next_match = Match.objects.get(id=tournamentMatch.match.id)
				next_match.player2_user = winner_user
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
			return JsonResponse({'success': 'Next match'}, status=200)
	return JsonResponse({'error': 'Invalid request'}, status=400)


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
			'name': tournament.created_by.display_name + _("'s tournament"),
			'current_stage': current_stage,
			'current_match': f'{current_match.player1_name} VS {current_match.player2_name}' if current_match else f'🏆: {tournament.winner}',
			'was_created_by_me': tournament.created_by == request.user
		}

		tournament_list.append(item)
	return JsonResponse({'tournaments': tournament_list}, status=200)


@login_required
def delete_tournament(request, tournament_id):
	tournament = Tournament.objects.get(id=tournament_id)
	if tournament.created_by == request.user:
		tournament.delete()
		return JsonResponse({'success': 'Tournament deleted'}, status=200)
	return JsonResponse({'error': 'Unauthorized'}, status=401)