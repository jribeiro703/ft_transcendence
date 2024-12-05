# user/management/commands/activation.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from user.models import User
import pyotp
from user.utils import send_activation_email
import logging
from smtplib import SMTPException
import random
import string
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Creates a test user and sends activation email'

    def _generate_random_username(self):
        # Use only lowercase letters for prefix
        prefix = ''.join(random.choices(string.ascii_lowercase, k=6))
        # Use only digits for suffix
        suffix = ''.join(random.choices(string.digits, k=3))
        # Combine without underscore to keep it alphanumeric
        return f"{prefix}{suffix}"

    def _generate_random_alias(self, username):
        prefix = ''.join(random.choices(string.ascii_lowercase, k=4))
        return f"alias_{prefix}_{username}"

    def _generate_random_email(self, username):
        domains = ['example.com', 'test.com', 'demo.com']
        return f"{username}@{random.choice(domains)}"

    def _generate_random_password(self):
        # Ensure password meets minimum length requirement
        chars = string.ascii_letters + string.digits + string.punctuation
        return ''.join(random.choices(chars, k=12))

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, 
                          default=self._generate_random_username())
        parser.add_argument('--email', type=str,
                          default=None)
        parser.add_argument('--password', type=str,
                          default=self._generate_random_password())
        parser.add_argument('--alias', type=str,
                          default=None)

    def handle(self, *args, **kwargs):
        username = kwargs['username']
        email = kwargs['email'] or self._generate_random_email(username)
        password = kwargs['password']
        alias = kwargs['alias'] or self._generate_random_alias(username)

        try:
            # Check if email is already used by active user
            if User.objects.filter(email=email, is_active=True).exists():
                raise ValidationError("This email is already used by an active user")

            # Create user with all required fields
            user = User.objects.create(
                username=username,
                email=email,
                alias=alias,
                is_active=False,
                otp_secret=pyotp.random_base32(),
                is_online=False
            )
            user.set_password(password)
            user.full_clean()  # Validate all fields
            user.save()

            # Try sending activation email
            try:
                send_activation_email(
                    user,
                    'activate_link',
                    'activate_account', 
                    'Activate your account',
                    'emails/account_activation.txt',
                    'emails/account_activation.html'
                )
            except SMTPException as e:
                logger.error(f"SMTP error: {str(e)}")
                self.stdout.write(self.style.WARNING(
                    f'User created but email failed: {str(e)}\n'
                    f'User details:\n'
                    f'Username: {username}\n'
                    f'Email: {email}\n'
                    f'Password: {password}\n'
                    f'Alias: {alias}'
                ))
                user.delete()
                return

            self.stdout.write(self.style.SUCCESS(
                f'Successfully created test user:\n'
                f'Username: {username}\n'
                f'Email: {email}\n'
                f'Password: {password}\n'
                f'Alias: {alias}\n'
                f'Check Mailhog at http://localhost:8025 for activation email'
            ))

        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            self.stdout.write(self.style.ERROR(f'Validation error: {str(e)}'))
        except Exception as e:
            logger.error(f"User creation error: {str(e)}")
            self.stdout.write(self.style.ERROR(f'Error creating user: {str(e)}'))