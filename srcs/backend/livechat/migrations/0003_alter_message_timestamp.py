# Generated by Django 5.1 on 2024-11-22 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livechat', '0002_alter_message_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
