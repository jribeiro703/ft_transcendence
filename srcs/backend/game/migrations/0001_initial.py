# Generated by Django 5.1 on 2025-01-15 12:22

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tournament', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('NOT_STARTED', 'Not Started'), ('ONGOING', 'Ongoing'), ('PAUSED', 'Paused'), ('COMPLETED', 'Completed'), ('CANCELED', 'Canceled')], default='NOT_STARTED', max_length=20)),
                ('difficulty', models.CharField(choices=[('EASY', 'Easy'), ('MEDIUM', 'Medium'), ('HARD', 'Hard')], default='EASY', max_length=10)),
                ('level', models.CharField(choices=[('TABLETENNIS', 'Table Tennis'), ('FOOTBALL', 'Football'), ('TENNIS', 'Tennis'), ('CLASSIC', 'Classic')], default='CLASSIC', max_length=20)),
                ('username_one', models.CharField(blank=True, max_length=50, null=True)),
                ('player_one_guest', models.CharField(blank=True, max_length=50, null=True)),
                ('username_two', models.CharField(blank=True, max_length=50, null=True)),
                ('player_two_guest', models.CharField(blank=True, max_length=50, null=True)),
                ('score_one', models.PositiveIntegerField(default=0)),
                ('score_two', models.PositiveIntegerField(default=0)),
                ('max_score', models.PositiveIntegerField(default=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('start_time', models.DateTimeField(blank=True, null=True)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('powerup', models.BooleanField(default=False)),
                ('time_played', models.IntegerField(default=0)),
                ('walkover', models.BooleanField(default=False)),
                ('player_one', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='game_as_player_one', to=settings.AUTH_USER_MODEL)),
                ('player_two', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='game_as_player_two', to=settings.AUTH_USER_MODEL)),
                ('tournament', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tournament_games', to='tournament.tournament')),
                ('winner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='game_as_winner', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='GamePlayer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('IDLE', 'Idle'), ('READY', 'Ready'), ('ACTIVE', 'Active'), ('DISCONNECTED', 'Disconnected'), ('ELIMINATED', 'Eliminated')], default='IDLE', max_length=20)),
                ('alias', models.CharField(blank=True, max_length=50, null=True)),
                ('is_winner', models.BooleanField(default=False)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='game_players', to='game.game')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='game_participations', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
