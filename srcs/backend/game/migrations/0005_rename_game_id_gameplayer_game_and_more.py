# Generated by Django 5.1 on 2024-11-22 11:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0004_game_end_time_game_max_score_game_start_time_and_more'),
        ('tournament', '0004_remove_tournament_game_tournament_created_by_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gameplayer',
            old_name='game_id',
            new_name='game',
        ),
        migrations.RenameField(
            model_name='gameplayer',
            old_name='user_id',
            new_name='user',
        ),
        migrations.AddField(
            model_name='game',
            name='tournament',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tournament_games', to='tournament.tournament'),
        ),
        migrations.AlterField(
            model_name='game',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='game',
            name='max_score',
            field=models.PositiveIntegerField(default=10),
        ),
        migrations.AlterField(
            model_name='game',
            name='score_one',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='game',
            name='score_two',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
