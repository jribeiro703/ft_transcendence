from django.core.management.base import BaseCommand
from django.utils import timezone
import random
from user.models import User
from game.models import Game

class Command(BaseCommand):
    help = 'Create fake match data for a specific user'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the user to create matches for')
        parser.add_argument('num_matches', type=int, help='Number of matches to create')

    def handle(self, *args, **kwargs):
        username = kwargs['username']
        num_matches = kwargs['num_matches']
        
        try:
            user = User.objects.get(username=username)  # Retrieve the user by username
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"User '{username}' does not exist."))
            return

        # Exclude the specified user and superusers
        users = list(User.objects.filter(is_active=True, is_superuser=False).exclude(id=user.id))

        if len(users) < 1:
            self.stdout.write(self.style.WARNING("Not enough users to create matches."))
            return

        for _ in range(num_matches):
            player_two = random.choice(users)  # Select one random player
            score_one = random.randint(0, 10)  # Random score for player one
            score_two = random.randint(0, 10)  # Random score for player two
            
            # Determine the winner based on scores
            winner = user if score_one > score_two else player_two if score_two > score_one else None
            
            game = Game.objects.create(
                player_one=user,
                player_two=player_two,
                status='NOT_STARTED',
                difficulty=random.choice(['EASY', 'MEDIUM', 'HARD']),
                level=random.choice(['TABLETENNIS', 'FOOTBALL', 'TENNIS', 'CLASSIC']),
                # max_score=random.randint(5, 15),  # Random maximum score between 5 and 15
                # created_at=timezone.now(),
                # start_time=None,
                # end_time=None,
                powerup=random.choice([True, False]),
                time_played=random.randint(0, 300),  # Random play time between 0 and 300 seconds
                score_one=score_one,  # Assign random score for player one
                score_two=score_two,   # Assign random score for player two
                winner=winner          # Assign the winner
            )
            self.stdout.write(self.style.SUCCESS(f"Match created: {game} between {user.username} and {player_two.username} with scores {score_one} - {score_two}. Winner: {winner.username if winner else 'Draw'}"))
