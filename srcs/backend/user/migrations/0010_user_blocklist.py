# Generated by Django 5.1 on 2024-12-17 09:20

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0009_remove_user_last_activity'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='blocklist',
            field=models.ManyToManyField(blank=True, related_name='blocked_by', to=settings.AUTH_USER_MODEL, verbose_name='blocklist'),
        ),
    ]
