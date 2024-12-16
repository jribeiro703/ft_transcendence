# Generated by Django 5.1 on 2024-12-12 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livechat', '0005_alter_message_nickname'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='is_game_chat',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='message',
            name='room',
            field=models.CharField(db_index=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='message',
            name='nickname',
            field=models.CharField(max_length=30),
        ),
        migrations.AlterField(
            model_name='message',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AddIndex(
            model_name='message',
            index=models.Index(fields=['room', '-timestamp'], name='livechat_me_room_e1cfb0_idx'),
        ),
    ]