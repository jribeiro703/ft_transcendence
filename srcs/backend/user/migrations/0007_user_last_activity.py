# Generated by Django 5.1 on 2024-12-06 11:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_alter_user_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='last_activity',
            field=models.DateTimeField(null=True),
        ),
    ]
