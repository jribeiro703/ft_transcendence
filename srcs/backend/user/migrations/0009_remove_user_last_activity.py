# Generated by Django 5.1 on 2024-12-13 18:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0008_merge_0007_user_is_42_user_0007_user_last_activity'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='last_activity',
        ),
    ]
