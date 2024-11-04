import pyotp
import pytz
from .models import User
from transcendence import settings
from django.urls import reverse
# from django.utils import timezone
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.translation import gettext_lazy as _
from django.core.mail import send_mail, EmailMultiAlternatives
from django.core.exceptions import ValidationError
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.template.loader import render_to_string
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from datetime import datetime, timezone

# local_time = datetime.now(pytz.timezone('Europe/Paris'))
User = get_user_model()
	
class UserCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username', 'email', 'password')
		extra_kwargs = {
            'password': {'write_only': True}
        }

	def _send_activation_email(self, user):
		uid = urlsafe_base64_encode(force_bytes(user.pk))
		token = default_token_generator.make_token(user)
		activation_link = reverse('signup_user_activate', kwargs={'uidb64': uid, 'token': token}) # generate a url with  passed viewname and parameters
		full_link = f'https://localhost:8081{activation_link}'

		text_content = render_to_string("emails/account_activation.txt", context={"full_link": full_link},)
		html_content = render_to_string("emails/account_activation.html", context={"full_link": full_link},)

		email = EmailMultiAlternatives(
			subject='Activate Your Account',
			body=text_content,
			from_email=settings.DEFAULT_FROM_EMAIL,
			to=[user.email]
		)
		email.attach_alternative(html_content, "text/html")
		user.email_sent_at = timezone.now()
		user.save()
		email.send()

	def create(self, validated_data):
		password = validated_data.pop('password')
		user = super().create(validated_data)
		user.set_password(password)
		user.is_active = False
		user.otp_secret = pyotp.random_base32()
		user.save()
		self._send_activation_email(user)
		return user

      
class UserLoginSerializer(serializers.Serializer):
	username = serializers.CharField(max_length=30)
	password = serializers.CharField(write_only=True)

	def _send_2FA_mail(self, user):
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

	def validate(self, attrs):
		username = attrs.get('username')
		password = attrs.get('password')
		if not username or not password:
			raise ValidationError(_("Username and password are required."))
		user = authenticate(username=username, password=password)
		if user is None:
			raise ValidationError(_("Invalid username or password."))
		if not user.is_active:
			raise ValidationError(_("User account is not actived."))
		if user.is_staff:
			raise serializers.ValidationError({
			    "detail": "Redirect to admin login",
			    "redirect_url": "/admin/login/"
			})
		self._send_2FA_mail(user)
		attrs['user'] = user
		return attrs

class OtpCodeChecking(serializers.Serializer):
	otp_code = serializers.CharField(required=True, write_only=True)

	def validate_otp_code(self, value):
		user = self.context.get('user')
		if user is None:
			raise serializers.ValidationError(_("User not found."))
		totp = pyotp.TOTP(user.otp_secret, interval=300)
		if not totp.verify(value, for_time=datetime.now(timezone.utc)):
			raise serializers.ValidationError(_("Invalid OTP code."))
		return value


# class CookieTokenRefreshSerializer(TokenRefreshSerializer):
#     refresh = None
#     def validate(self, attrs):
#         attrs['refresh'] = self.context['request'].COOKIES.get('refresh_token')
#         if attrs['refresh']:
#             return super().validate(attrs)
#         else:
#             raise InvalidToken('No valid token found in cookie \'refresh_token\'')
