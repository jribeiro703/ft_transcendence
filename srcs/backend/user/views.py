from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.utils.translation import gettext_lazy as _
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import timezone, timedelta
from .serializers import UserCreateSerializer, UserLoginSerializer, OtpCodeChecking, UserViewSetSerializer
from .models import User
from .permissions import IsOwner

@api_view(['GET'])
def user_index(request):
	# data = {"message": "Hello, world from user app !"}
	users = User.objects.all()
	serializer = UserViewSetSerializer(users, many=True)
	return Response(serializer.data, status=status.HTTP_200_OK)

class CreateUserView(CreateAPIView):
	model = get_user_model()
	permission_classes = [AllowAny]
	serializer_class = UserCreateSerializer

class ActivateAccountView(APIView):
	permission_classes = [AllowAny]
	def get(self, request, uidb64, token):
		try:
			uid = force_str(urlsafe_base64_decode(uidb64))
			user = get_object_or_404(User, pk=uid)
		except (TypeError, ValueError, OverflowError, User.DoesNotExist):
			user = None
            
		if user is not None and default_token_generator.check_token(user, token):
			expiration_duration = timedelta(hours=24)
			if timezone.now() - user.email_sent_at > expiration_duration:
				user.delete()
				return Response({"message": "Activation link has expired"}, status=status.HTTP_400_BAD_REQUEST)
			user.is_active = True
			user.save()
			return Response({"message": "Account activated successfully"}, status=status.HTTP_200_OK)
		else:
		    return Response({"message": "Activation link is invalid"}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
	model = get_user_model()
	permission_classes = [AllowAny]
	serializer_class = UserLoginSerializer
      
	def post(self, request, *args, **kwargs):
		serializer = self.serializer_class(data=request.data)
		serializer.is_valid(raise_exception=True)

		user = serializer.validated_data['user']
		otp_verification_url = reverse('otp_verification', args=[user.id])

		return Response({
		    "message": "Send verification code successfully",
		    "otp_verification_url": otp_verification_url
		}, status=status.HTTP_200_OK)

class OtpVerificationView(APIView):
	permission_classes = [AllowAny]
	serializer_class = OtpCodeChecking

	def post(self, request, user_id, *args, **kwargs):
		user = get_object_or_404(get_user_model(), id=user_id)

		serializer = self.serializer_class(data=request.data, context={'user': user})
		serializer.is_valid(raise_exception=True)

		refresh = RefreshToken.for_user(user)
		access_token = str(refresh.access_token)
		refresh_token = str(refresh)

		response = Response({"access_token": access_token}, status=status.HTTP_200_OK)
		cookie_max_age = 3600 * 24  # 1 jour
		response.set_cookie(
			'refresh_token',
		    refresh_token,
		    max_age=cookie_max_age,
		    httponly=True
		)
		return response

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successfully !"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"message": "Logout failed"}, status=status.HTTP_400_BAD_REQUEST)

class UserRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
	queryset = User.objects.all()
	serializer_class = UserViewSetSerializer
	# authentication_classes = [JWTAuthentication]
	# permission_classes = [IsAuthenticated, IsOwner]
	authentication_classes = []
	permission_classes = []	
    
	