# Generated by Django 5.1 on 2024-12-24 08:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0012_merge_0009_delete_message_0011_message'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='username_one',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='game',
            name='username_two',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
