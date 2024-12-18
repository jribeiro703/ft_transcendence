# Generated by Django 5.1 on 2024-11-22 11:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0005_rename_game_id_gameplayer_game_and_more'),
        ('tournament', '0004_remove_tournament_game_tournament_created_by_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tournament',
            name='games',
            field=models.ManyToManyField(related_name='tournament_matchups', to='game.game'),
        ),
    ]
