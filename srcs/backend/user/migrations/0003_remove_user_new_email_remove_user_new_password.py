# Generated by Django 5.1 on 2024-11-14 17:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_rename_current_password_user_new_password'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='new_email',
        ),
        migrations.RemoveField(
            model_name='user',
            name='new_password',
        ),
    ]
