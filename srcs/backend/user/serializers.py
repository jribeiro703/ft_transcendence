from rest_framework import serializers
from .models import User

# class UserSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = User
# 		fields = ('id', 'username', 'alias', 'email', 'avatar', 'is_active', 'is_superuser', 'is_staff', 'friends', 'password')
# 		read_only_fields = ('is_superuser', 'id', 'is_staff', 'is_active', 'date_joined',) 
# 		extra_kwargs = {
#             'password': {'write_only': True}
#         }

# 	def create(self, validated_data):
# 		password = validated_data.pop('password')
# 		user = User(**validated_data)
# 		user.set_password(password)
# 		user.save()
# 		return user

# 	def update(self, instance, validated_data):
# 		if 'password' in validated_data:
# 			password = validated_data.pop('password')
# 			instance.set_password(password)
# 		return super(UserSerializer, self).update(instance, validated_data)
	
class UserCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('username', 'alias', 'email', 'avatar', 'password')
		extra_kwargs = {
            'password': {'write_only': True}
        }

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