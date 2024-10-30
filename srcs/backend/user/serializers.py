from .models import User
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator

from rest_framework import serializers
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

	
class UserCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('username', 'alias', 'email', 'avatar', 'password')
		extra_kwargs = {
            'password': {'write_only': True}
        }

	# def _send_activation_email(self, user):
	# 	uid = urlsafe_base64_encode(force_bytes(user.pk))
	# 	token = default_token_generator.make_token(user)
	# 	activation_link = reverse('signup-user-activate', kwargs={'uidb64': uid, 'token': token})
	# 	full_link = f'http://localhost:8000{activation_link}'

	# 	subject = 'Activate Your Account'
	# 	message = f'Please activate your account by clicking the link: {full_link}'
	# 	send_mail(subject, message, 'fttrans0@gmail.com', [user.email])

	def create(self, validated_data):
		password = validated_data.pop('password')
		user = super().create(validated_data)
		user.set_password(password)
		user.is_active = False
		user.save()
		self._send_activation_email(user)
		return user

	# def update(self, instance, validated_data):
	# 	if 'password' in validated_data:
	# 		password = validated_data.pop('password')
	# 		instance.set_password(password)
	# 	return super(UserCreateSerializer, self).update(instance, validated_data)
	
class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh_token')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken('No valid token found in cookie \'refresh_token\'')