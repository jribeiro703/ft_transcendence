import pyotp
from .models import User, FriendRequest
from transcendence import settings
from django.utils.translation import gettext_lazy as _
from django.core.mail import EmailMultiAlternatives
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from django.template.loader import render_to_string
from rest_framework import serializers
from datetime import datetime, timezone
from .utils import send_activation_email

class IndexSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username', 'alias', 'avatar', 'email', 'password', 'friends', 'is_online', 'is_active')

class UserCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username', 'email', 'password')
		extra_kwargs = {'password': {'write_only': True}}

	def create(self, validated_data):
		
		if User.objects.filter(email=validated_data['email'], is_active=True).exists():
			raise serializers.ValidationError("Registration impossible, this email is already used by a active user.")
		
		password = validated_data.pop('password')
		user = super().create(validated_data)
		user.set_password(password)
		user.is_active = False
		user.otp_secret = pyotp.random_base32()
		user.save()

		try:
			send_activation_email(
			user,
			'account_activate',
			'Activate your account',
			'emails/account_activation.txt',
			'emails/account_activation.html'
			)
		except Exception as e:
			user.delete()
			raise serializers.ValidationError(f"Error: send activation mail failed : {str(e)}")
		
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
			raise serializers.ValidationError(_("Username and password are required."))
		user = authenticate(username=username, password=password)
		if user is None:
			raise serializers.ValidationError(_("Non-active account or Invalid username/password."))
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

class UserViewSetSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username', 'alias', 'avatar', 'email', 'password', 'current_password', 'friends', 'is_online', 'is_active')
		read_only_fields = ('id', 'username', 'is_active', 'is_online')
		extra_kwargs = {'password': {'write_only': True}, 'current_password': {'write_only': True}}

		def update(self, instance, validated_data):
			raise serializers.ValidationError("The current password is required to update your password.")
			# if 'password' in validated_data:
			# 	# if 'current_password' not in validated_data or validated_data['current_password'] is None:
			# 	# elif validated_data['current_password'] != instance.password:
			# 		# raise serializers.ValidationError("The current password does not match the existing password.")
			# 	# instance.set_password(validated_data['password'])
			# 	# validated_data.pop('password')

			# if 'email' in validated_data:
			# 	try:
			# 		instance.is_active = False
			# 		send_activation_email(
			# 			instance,
			# 			'account_activate',
			# 			'New Email Verification',
			# 			'emails/mail_changed.txt',
			# 			'emails/mail_changed.html'
			# 			)
			# 	except Exception as e:
			# 		instance.is_activate = True
			# 		raise serializers.ValidationError(f"Error: send mail to new email adress failed : {str(e)}")

			# if 'friends' in validated_data:
			# 	new_friend = validated_data['friends']
			# 	if instance.friends.filter(pk=new_friend.pk).exists():
			# 		self.context['request'].success_message = f"{new_friend.username} is already in your actual friends list"
			# 	else:
			# 		if not FriendRequest.objects.filter(sender=instance, receiver=new_friend).exists():
			# 			FriendRequest.objects.create(sender=instance, receiver=new_friend)
			# 			self.context['request'].success_message = f"Friend request sent to {new_friend.username} successfully."
			# 		else:
			# 			self.context['request'].success_message = f"You have already sent a friend request to {new_friend.username}."
			# 	validated_data.pop('friends')

			# for attr, value in validated_data.items():
			# 	setattr(instance, attr, value)
			# instance.save()
			return instance




	