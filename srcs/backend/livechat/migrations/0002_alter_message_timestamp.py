# Generated by Django 5.1 on 2024-11-22 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livechat', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='timestamp',
            field=models.DateTimeField(),
        ),
    ]
