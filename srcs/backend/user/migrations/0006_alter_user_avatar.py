# Generated by Django 5.1 on 2024-11-26 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_alter_user_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='default-avatar.jpg', upload_to='avatars/', verbose_name='avatar'),
        ),
    ]
