# Generated by Django 5.1 on 2025-01-16 10:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('FINISHED', 'Finished'), ('WO', 'Walkover')], default='PENDING', max_length=20)),
                ('difficulty', models.CharField(choices=[('EASY', 'Easy'), ('MEDIUM', 'Medium'), ('HARD', 'Hard')], default='EASY', max_length=10)),
                ('level', models.CharField(choices=[('TABLETENNIS', 'Table Tennis'), ('FOOTBALL', 'Football'), ('TENNIS', 'Tennis'), ('CLASSIC', 'Classic')], default='CLASSIC', max_length=20)),
                ('username_one', models.CharField(blank=True, max_length=50, null=True)),
                ('username_two', models.CharField(blank=True, max_length=50, null=True)),
                ('score_one', models.PositiveIntegerField(default=0)),
                ('score_two', models.PositiveIntegerField(default=0)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('walkover', models.BooleanField(default=False)),
                ('powerup', models.BooleanField(default=False)),
                ('time_played', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='GamePlayer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('IDLE', 'Idle'), ('READY', 'Ready'), ('ACTIVE', 'Active'), ('DISCONNECTED', 'Disconnected'), ('ELIMINATED', 'Eliminated')], default='IDLE', max_length=20)),
                ('alias', models.CharField(blank=True, max_length=50, null=True)),
                ('is_winner', models.BooleanField(default=False)),
            ],
        ),
    ]
