# Generated by Django 5.1 on 2024-12-16 14:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livechat', '0006_message_is_game_chat_message_room_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nickname_sender', models.CharField(max_length=30)),
                ('nickname_receiver', models.CharField(max_length=30)),
                ('content', models.CharField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('notification_type', models.CharField(choices=[('friend_request', 'Friend Request'), ('game_invite', 'Game Invite'), ('tournament_invite', 'Tournament Invite')], max_length=50)),
                ('is_read', models.BooleanField(default=False)),
                ('is_accepted', models.BooleanField(default=False)),
            ],
        ),
    ]