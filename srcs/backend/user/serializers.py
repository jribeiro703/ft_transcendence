import pyotp
from .models import User, FriendRequest
from transcendence import settings
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth import authenticate
from django.template.loader import render_to_string
from rest_framework import serializers, exceptions
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
			raise serializers.ValidationError({
				"message": "Registration failed, this email is already used by a active user"
			})
		
		password = validated_data.pop('password')
		user = super().create(validated_data)
		user.set_password(password)
		user.is_active = False
		user.otp_secret = pyotp.random_base32()
		user.save()

		try:
			send_activation_email(
			user,
			'activate_link',
			'activate_account',
			'Activate your account',
			'emails/account_activation.txt',
			'emails/account_activation.html'
			)
		except Exception as e:
			user.delete()
			raise exceptions.APIException({"message": "Send activation email failed"})
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

		try:
			email = EmailMultiAlternatives(
				subject='Your 2FA Verification Code',
				body=text_content,
				from_email=settings.DEFAULT_FROM_EMAIL,
				to=[user.email]
			)
			email.attach_alternative(html_content, "text/html")
			email.send()
		except Exception as e:
			raise exceptions.APIException({"message": "Send 2FA verification email failed"})

	def validate(self, attrs):
		username = attrs.get('username')
		password = attrs.get('password')
		
		if not username or not password:
			raise serializers.ValidationError({"message": "Username and password are required"})
		user = authenticate(username=username, password=password)
		if user is None or user.is_staff:
			raise exceptions.NotAuthenticated({"message": "Non-active account or Invalid username/password"})
		
		self._send_2FA_mail(user)
		attrs['user'] = user
		return attrs

class OtpCodeSerializer(serializers.Serializer):
	otp_code = serializers.CharField(required=True, write_only=True)

	def validate_otp_code(self, value):
		user = self.context.get('user')
		if user is None:
			raise serializers.ValidationError({"message": "User not found."})
		totp = pyotp.TOTP(user.otp_secret, interval=300)
		if not totp.verify(value, for_time=datetime.now(timezone.utc)):
			raise exceptions.NotAuthenticated({"message": "Invalid OTP code."})
		return value

# class UserProfileSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = User
# 		fields = ()

class UserSettingsSerializer(serializers.ModelSerializer):

	new_email = serializers.EmailField(write_only=True, required=False, allow_blank=True)
	new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
	new_friend = serializers.CharField(write_only=True, required=False, allow_blank=True)

	class Meta:
		model = User
		fields = ('id', 'username', 'alias', 'avatar', 'email', 'new_email', 'password', 'new_password', 'friends','new_friend', 'is_online', 'is_active')
		read_only_fields = ('id', 'username', 'is_active', 'is_online', 'email', 'friends')
		extra_kwargs = {'password': {'write_only': True}, 'new_password': {'write_only': True}, 'new_email': {'write_only': True}, 'new_friend': {'write_only': True}}

	def update(self, instance, validated_data):
		success_messages = []

		if 'new_password' in validated_data:
			if 'password' not in validated_data or validated_data['password'] is None:
				raise serializers.ValidationError({"message": "The current password is required to update your new password."})
			elif not instance.check_password(validated_data['password']):
				raise serializers.ValidationError({"message": "The current password does not match the existing password."})
			elif instance.check_password(validated_data['new_password']):
				raise serializers.ValidationError({"message": "Your new password is the same as the existing password."})
			instance.set_password(validated_data['new_password'])
			success_messages.append("Password changed successfully !")
			validated_data.pop('new_password')

		if 'new_email' in validated_data and validated_data['new_email'] is not None:
			if User.objects.filter(email=validated_data['new_email'], is_active=True).exists():
				raise serializers.ValidationError({"message": "Changing to new email failed, this email is already used by a active user."})
			try:
				send_activation_email(
					instance,
					'activate_link',
					'verify_email',
					'New Email Verification',
					'emails/mail_changed.txt',
					'emails/mail_changed.html'
					)
				success_messages.append("A confirmation email has been sent to your new email address.")
			except Exception as e:
				raise exceptions.APIException({"message": "Send mail to new email adress failed"})
		
		if 'new_friend' in validated_data:
			try:
				new_f = User.objects.get(username=validated_data['new_friend'])
				if instance.friends.filter(username=new_f.username).exists():
					success_messages.append(f"{new_f.username} is already in your actual friends list")
				else:
					if not FriendRequest.objects.filter(sender=instance, receiver=new_f).exists():
						FriendRequest.objects.create(sender=instance, receiver=new_f)
						success_messages.append(f"Friend request sent to {new_f.username} successfully.")
					else:
						success_messages.append(f"You have already sent a friend request to {new_f.username}.")
			except User.DoesNotExist:
				raise serializers.ValidationError({"message": f"{validated_data['new_friend']} doesn't exist"})
				
		for attr, value in validated_data.items():
			setattr(instance, attr, value)
		success_messages.append("Update successfully")
		instance.save()
		return instance, success_messages




	
