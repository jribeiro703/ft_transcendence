from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils import timezone
from transcendence import settings
import pyotp
from datetime import datetime, timezone

def send_activation_email(user, view_name, action, subject, text_file, html_file):
	uid = urlsafe_base64_encode(force_bytes(user.pk))
	token = default_token_generator.make_token(user)
	activation_link = reverse(view_name, kwargs={'action': action, 'uidb64': uid, 'token': token}) # generate a url with  passed viewname and parameters
	full_link = f'https://localhost:8081{activation_link}'

	text_content = render_to_string(text_file, context={"full_link": full_link},)
	html_content = render_to_string(html_file, context={"full_link": full_link},)

	email = EmailMultiAlternatives(
		subject=subject,
		body=text_content,
		from_email=settings.DEFAULT_FROM_EMAIL,
		to=[user.email]
	)
	email.attach_alternative(html_content, "text/html")
	user.email_sent_at = timezone.now()
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