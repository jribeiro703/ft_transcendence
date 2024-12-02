# user/management/commands/create_testuser.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from user.models import User
import pyotp
from user.utils import send_activation_email
import logging
from smtplib import SMTPException
import random
import string

logger = logging.getLogger(__name__)

class Command(BaseCommand):
	help = 'Creates a test user and sends activation email'

	def _generate_random_username(self):
		prefix = ''.join(random.choices(string.ascii_lowercase, k=6))
		suffix = ''.join(random.choices(string.digits, k=3))
		return f"user_{prefix}{suffix}"

	def _generate_random_email(self, username):
		domains = ['example.com', 'test.com', 'demo.com']
		return f"{username}@{random.choice(domains)}"

	def _generate_random_password(self):
		chars = string.ascii_letters + string.digits + string.punctuation
		return ''.join(random.choices(chars, k=12))

	def add_arguments(self, parser):
		parser.add_argument('--username', type=str, 
						  default=self._generate_random_username())
		parser.add_argument('--email', type=str,
						  default=None)  # Will be set based on username
		parser.add_argument('--password', type=str,
						  default=self._generate_random_password())

	def handle(self, *args, **kwargs):
		username = kwargs['username']
		email = kwargs['email'] or self._generate_random_email(username)
		password = kwargs['password']

		try:
			# Create user first
			user = User.objects.create(
				username=username,
				email=email,
				is_active=False,
				otp_secret=pyotp.random_base32(),
				alias=f'alias_{username}'
			)
			user.set_password(password)
			user.save()

			# Try sending email
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
					f'Password: {password}'
				))
				return

			self.stdout.write(self.style.SUCCESS(
				f'Successfully created test user:\n'
				f'Username: {username}\n'
				f'Email: {email}\n'
				f'Password: {password}\n'
				f'Check Mailhog at http://localhost:8025 for activation email'
			))

		except Exception as e:
			logger.error(f"User creation error: {str(e)}")
			self.stdout.write(self.style.ERROR(f'Error creating user: {str(e)}'))