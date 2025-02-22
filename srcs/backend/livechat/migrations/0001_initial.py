# Generated by Django 5.1 on 2025-01-24 17:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
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
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nickname', models.CharField(max_length=30)),
                ('content', models.TextField(max_length=512)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('room', models.CharField(db_index=True, max_length=50, null=True)),
                ('is_game_chat', models.BooleanField(default=False)),
            ],
            options={
                'indexes': [models.Index(fields=['room', '-timestamp'], name='livechat_me_room_e1cfb0_idx')],
            },
        ),
    ]
