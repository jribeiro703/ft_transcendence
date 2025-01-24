from django.db import models
from user.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.translation import gettext as _
from tournament.models import Guest
from game.models import Game
import json
from django.db.models import F
import logging

logger = logging.getLogger(__name__)

def get_game_context(user: User):
    gamesMain = Game.objects.filter(player_one=user).order_by('-timestamp')
    gamesOpponent = Game.objects.filter(player_two=user).order_by('-timestamp')
    games = gamesMain | gamesOpponent.order_by('-timestamp')
    games = games.exclude(status='WO')
    victoriesMain = gamesMain.filter(score_one__gt=F('score_two')).count()
    victoriesOpponent = gamesOpponent.filter(score_two__gt=F('score_one')).count()
    lossesMain = gamesMain.filter(score_one__lt=F('score_two')).count()
    lossesOpponent = gamesOpponent.filter(score_two__lt=F('score_one')).count()
    display_name = user.username
    avatar = user.avatar

    return {
        'display_name': display_name,
        'avatar': avatar,
        'games': games,
        'victories': victories,
        'losses': losses,
    }

#used
@csrf_exempt
def validate_game_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            player_id = data.get('player_id')
            game_token = data.get('game_token')

            logger.debug(f"Received player_id: {player_id}, game_token: {game_token}")

            try:
                player = User.objects.get(id=player_id)
                logger.debug(f"Player found: {player.username}, Expected token: {player.game_token}")

                if player.game_token == game_token:
                    logger.info(f"Game token validation successful for player_id: {player_id}")
                    return JsonResponse({'valid': True})
                else:
                    logger.warning(f"Game token mismatch for player_id: {player_id}. Received: {game_token}, Expected: {player.game_token}")

            except User.DoesNotExist:
                logger.error(f"User with id {player_id} does not exist.")
                pass
        except json.JSONDecodeError:
            logger.error("Invalid JSON received.")
            return JsonResponse({'valid': False, 'error': 'Invalid JSON'})

    logger.warning(f"Game token validation failed for player_id: {player_id}, game_token: {game_token}")
    return JsonResponse({'valid': False, 'player_id': player_id, 'game_token': game_token})


@csrf_exempt
def create_game(request):
    if request.method == 'POST':
        difficulty = request.POST.get('difficulty')
        player1_user_id = request.POST.get('player1_user')
        player1_guest_name = request.POST.get('player1_guest')
        player2_user_id = request.POST.get('player2_user')
        player2_guest_name = request.POST.get('player2_guest')

        # Handle Player 1
        if player1_guest_name:
            player1_guest, created = Guest.objects.get_or_create(display_name=player1_guest_name)
            player1_user = None
        else:
            player1_user = User.objects.get(id=player1_user_id)
            player1_guest = None
        
        # Handle Player 2
        if player2_guest_name:
            player2_guest, created = Guest.objects.get_or_create(display_name=player2_guest_name)
            player2_user = None
        else:
            player2_user = User.objects.get(id=player2_user_id)
            player2_guest = None

        # Create the Game
        game = Game(
            player_one=player1_user,
            player1_guest=player1_guest,
            player_two=player2_user,
            player2_guest=player2_guest,
            difficulty=difficulty,
            score_one=0,
            score_two=0,
        )
        game.save()
        return JsonResponse({'success': 'Game created', 'game_id': game.id}, status=200)
    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def update_result_wo(request, game_id):
    if request.method == 'POST':
        try:
            game = Game.objects.get(pk=game_id)
            if game.status == 'PENDING':
                game.status = 'WO'
                game.walkover = True
                game.save()
            return JsonResponse({'success': 'Game result updated'}, status=200)
        except Game.DoesNotExist:
            return JsonResponse({'error': 'Game not found'}, status=404)
    return JsonResponse({'error': 'Invalid request'}, status=400)


def update_game_result(request, game_id):
    if request.method == 'POST':
        try:
            game = Game.objects.get(pk=game_id)
            game.status = 'FINISHED'
            game.score_one = request.POST.get('score_one')
            game.score_two = request.POST.get('score_two')
            game.save()
            return JsonResponse({'success': 'Game result updated'}, status=200)
        except:
            return JsonResponse({'error': 'Game not found'}, status=404)
    return JsonResponse({'error': 'Invalid request'}, status=400)


def get_game_status(request, game_id):
    # return status of the Game and the winner's display name
    if request.method == 'GET':
        try:
            game = Game.objects.get(pk=game_id)
            if game.status == 'FINISHED':
                if game.score_one > game.score_two:
                    winner = game.player_one.username if game.player_one else game.player1_guest.display_name
                else:
                    winner = game.player_two.username if game.player_two else game.player2_guest.display_name
                return JsonResponse({'status': _('{} has won').format(winner)}, status=200)
            if game.status == 'WO':
                return JsonResponse({'status': _('Game has been forfeited')}, status=200)
            else:
                return JsonResponse({'status': None}, status=200)
        except Game.DoesNotExist:
            return JsonResponse({'error': 'Game not found'}, status=404)
    return JsonResponse({'error': 'Invalid request'}, status=400)


def get_game_data(request, game_id):
    if request.method == 'GET':
        try:
            game = Game.objects.get(pk=game_id)
            tournament = game.tournament.id if game.tournament else None
            player1 = game.get_player1_name()
            player2 = game.get_player2_name()
            game_over = game.status == 'FINISHED' or game.status == 'WO'
            return JsonResponse({
                'tournament': tournament,
                'player1': player1,
                'score_player1': game.score_one,
                'player2': player2,
                'score_player2': game.score_two,
                'difficulty': game.difficulty,
                'game_over': game_over,
                'max_score': '5'
                }, status=200)
        except Game.DoesNotExist:
            return JsonResponse({'error': 'Game not found'}, status=404)
    return JsonResponse({'error': 'Invalid request'}, status=400)