# Generated by Django 5.1 on 2024-12-23 08:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0007_alter_tournament_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tournament',
            name='status',
            field=models.CharField(choices=[('UPCOMING', 'Upcoming'), ('ONGOING', 'Ongoing'), ('COMPLETED', 'Completed'), ('CANCELED', 'Canceled')], default='upcoming', max_length=20),
        ),
    ]
