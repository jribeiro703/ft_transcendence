# Generated by Django 5.1 on 2024-12-11 12:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0009_alter_message_nickname_alter_message_timestamp'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Message',
        ),
    ]
