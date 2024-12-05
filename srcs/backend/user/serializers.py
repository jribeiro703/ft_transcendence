import pyotp
from .models import User, FriendRequest
from rest_framework import serializers, exceptions
from datetime import datetime, timezone
from .utils import send_activation_email
from smtplib import SMTPException
import logging
logger = logging.getLogger(__name__)


# ------------------------------GET USER INFOS SERIALIZERS--------------------------------

class UserPrivateInfosSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = '__all__'

class UserPublicInfosSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username', 'alias', 'avatar', 'is_online')

# ------------------------------REGISTER USER SERIALIZERS--------------------------------	

class UserCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username', 'email', 'password')
		extra_kwargs = {'password': {'write_only': True}}

	def create(self, validated_data):
		
		if User.objects.filter(email=validated_data['email'], is_active=True).exists():
			raise serializers.ValidationError({"message": "This email is already used by a active user"})
		
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
		except SMTPException as e:
			logger.error(f"SMTP error sending activation email: {str(e)}")
			user.delete()
			raise exceptions.APIException({
				"message": f"SMTP error sending activation email: {str(e)}"
			})
		except Exception as e:
			logger.error(f"Unexpected error sending activation email: {str(e)}")
			user.delete()
			raise exceptions.APIException({"message": "Send activation email failed"})
		return user


# ------------------------------OTP VERIFICATION SERIALIZERS--------------------------------

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


# ------------------------------USER SETTINGS SERIALIZERS--------------------------------

class UserSettingsSerializer(serializers.ModelSerializer):

	new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
	new_friend = serializers.CharField(write_only=True, required=False, allow_blank=True)

	class Meta:
		model = User
		fields = ('id', 'is_online', 'username', 'alias', 'avatar', 'email', 'new_email', 'password', 'new_password', 'friends', 'new_friend')
		read_only_fields = ('id', 'username', 'is_online', 'avatar', 'email', 'friends')
		extra_kwargs = {'password': {'write_only': True}, 'new_password': {'write_only': True}, 'new_email': {'write_only': True}, 'new_friend': {'write_only': True}}

	def update(self, instance, validated_data):

		# print("validated_data", validated_data)

		# for password changing
		if 'new_password' in validated_data:
			if 'password' not in validated_data or validated_data['password'] is None:
				raise serializers.ValidationError({"message": "The current password is required to update your new password."})
			elif not instance.check_password(validated_data['password']):
				raise serializers.ValidationError({"message": "The current password does not match the existing password."})
			elif instance.check_password(validated_data['new_password']):
				raise serializers.ValidationError({"message": "Your new password is the same as the existing password."})
			instance.set_password(validated_data['new_password'])
			message = {"message": "Password changed successfully !"}

		# for email changing
		if 'new_email' in validated_data and validated_data['new_email'] is not None:
			if User.objects.filter(email=validated_data['new_email'], is_active=True).exists():
				raise serializers.ValidationError({"message": "Changing to new email failed, this email is already used by a active user."}) 
			instance.new_email = validated_data['new_email']
			try:
				send_activation_email(
					instance,
					'activate_link',
					'verify_email',
					'New Email Verification',
					'emails/mail_changed.txt',
					'emails/mail_changed.html'
					)
				message = {"message": "A confirmation email has been sent to your new email address."}
			except Exception as e:
				raise exceptions.APIException({"message": "Failed to send confirmation mail to the new email address."})
		
		# for send new friend request
		if 'new_friend' in validated_data:
			try:
				new_f = User.objects.get(username=validated_data['new_friend'])
				if instance.friends.filter(username=new_f.username).exists():
					message = {"message": f"{new_f.username} is already in your actual friends list"}
				else:
					if not FriendRequest.objects.filter(sender=instance, receiver=new_f).exists():
						FriendRequest.objects.create(sender=instance, receiver=new_f)
						message = {"message": f"Friend request sent to {new_f.username} successfully."}
					else:
						message = {"message": f"You have already sent a friend request to {new_f.username}."}
			except User.DoesNotExist:
				raise serializers.ValidationError({"message": f"{validated_data['new_friend']} doesn't exist"})
		
		try:
			if 'alias' in validated_data:
				setattr(instance, 'alias', validated_data['alias'])
				message = {"message": "Alias updated successfully."}
			if 'avatar' in validated_data:
				setattr(instance, 'avatar', validated_data['avatar'])
				message = {"message": "Avatar updated successfully."}
		except Exception as e:
			raise serializers.ValidationError({"message": "Update failed."})
			
		instance.save()
		return instance, message

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['id', 'username']


	
