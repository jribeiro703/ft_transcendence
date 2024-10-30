from .models import User
from django.core.mail import send_mail
from rest_framework import serializers

# class UserSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = User
# 		fields = ('id', 'username', 'alias', 'email', 'avatar', 'is_active', 'is_superuser', 'is_staff', 'friends', 'password')
# 		read_only_fields = ('is_superuser', 'id', 'is_staff', 'is_active', 'date_joined',) 
# 		extra_kwargs = {
#             'password': {'write_only': True}
#         }
	
class UserCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('username', 'alias', 'email', 'avatar', 'password')
		extra_kwargs = {
            'password': {'write_only': True}
        }

	def _send_activation_email(self, user):
		subject = 'Activate Your Account'
		message = f'Please activate your account by clicking the link: http://localhost:8000{reverse("activate", kwargs={"uidb64": urlsafe_base64_encode(force_bytes(user.pk)), "token": account_activation_token.make_token(user)})}'
		send_mail(subject, message, 'from@example.com', [user.email])

	def create(self, validated_data):
		password = validated_data.pop('password')
		user = super().create(validated_data)
		user.set_password(password)
		user.save()
		return user

	def update(self, instance, validated_data):
		if 'password' in validated_data:
			password = validated_data.pop('password')
			instance.set_password(password)
		return super(UserCreateSerializer, self).update(instance, validated_data)