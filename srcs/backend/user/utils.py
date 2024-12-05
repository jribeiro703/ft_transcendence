import pyotp
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.timezone import now
from django.utils.encoding import force_bytes
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from datetime import datetime, timezone
from transcendence import settings
from rest_framework_simplejwt.tokens import RefreshToken

def generate_activation_link(user, view_name, action):
	uid = urlsafe_base64_encode(force_bytes(user.pk))
	token = default_token_generator.make_token(user)
	activation_link = reverse(view_name, kwargs={'action': action, 'uidb64': uid, 'token': token})
	return activation_link

def send_activation_email(user, view_name, action, subject, text_file, html_file):
	activation_link = generate_activation_link(user, view_name, action)
	full_link = f'https://localhost:8081{activation_link}'

	context = {"full_link": full_link}
	text_content = render_to_string(text_file, context)
	html_content = render_to_string(html_file, context)

	email = EmailMultiAlternatives(
		subject=subject,
		body=text_content,
		from_email=settings.DEFAULT_FROM_EMAIL,
		to=[user.email]
	)
	email.attach_alternative(html_content, "text/html")
	user.email_sent_at = now()
	user.save()
	email.send()

def send_2FA_mail(user):
	totp = pyotp.TOTP(user.otp_secret, interval=300)  # validity 5min
	verification_code = totp.at(datetime.now(timezone.utc))

	context={"username": user.username, "verification_code": verification_code,}
	html_content = render_to_string("emails/2FA.html", context)
	text_content = render_to_string("emails/2FA.txt", context)

	email = EmailMultiAlternatives(
		subject='Your 2FA Verification Code',
		body=text_content,
		from_email=settings.DEFAULT_FROM_EMAIL,
		to=[user.email]
	)
	email.attach_alternative(html_content, "text/html")
	email.send()

def generate_tokens_for_user(user):
	refresh = RefreshToken.for_user(user)
	access_token = str(refresh.access_token)
	refresh_token = str(refresh)

	return access_token, refresh_token

def set_refresh_token_in_cookies(response, refresh_token, cookie_max_age=3600*24):
	response.set_cookie(
		'refresh_token',
		refresh_token,
		max_age=cookie_max_age,
		httponly=True,
		secure=True,
		samesite='Lax'
	)
	return response
