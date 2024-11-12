from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.utils.translation import gettext_lazy as _
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import timedelta
from django.utils import timezone
from .serializers import IndexSerializer, UserCreateSerializer, UserLoginSerializer, OtpCodeChecking, UserViewSetSerializer
from .models import User, FriendRequest
from .permissions import IsOwner

@api_view(['GET'])
def user_index(request):
	users = User.objects.all()
	serializer = IndexSerializer(users, many=True)
	return Response(serializer.data, status=status.HTTP_200_OK)

class CreateUserView(CreateAPIView):
	queryset = User.objects.all()
	permission_classes = [AllowAny]
	serializer_class = UserCreateSerializer
	
	def create(self, request, *args, **kwargs):
		response = super().create(request, *args, **kwargs)
		return Response({
			"message": "User created successfully. Please check your email to activate your account."
		}, status=status.HTTP_201_CREATED)

class ActivateLinkView(APIView):
	permission_classes = [AllowAny]
	def get(self, request, uidb64, token, action):
		try:
			uid = force_str(urlsafe_base64_decode(uidb64))
			user = get_object_or_404(User, pk=uid)
		except (TypeError, ValueError, OverflowError, User.DoesNotExist):
			user = None
            
		if user is not None and default_token_generator.check_token(user, token):
			expiration_duration = timedelta(hours=24)
			if timezone.now() - user.email_sent_at > expiration_duration:
				user.delete()
				return Response({"message": "Activation link has expired."}, status=status.HTTP_400_BAD_REQUEST)
			
			if action == 'verify_email' and user.new_email:
				user.email = user.new_email
				user.new_email = None
				user.save()
				return Response({"message": "Email address confirmed successfully!"}, status=status.HTTP_200_OK)

			if action == 'activate_account':
				user.is_active = True
				user.save()
				return Response({"message": "Account activated successfully!"}, status=status.HTTP_200_OK)
			return Response({"message": "Invalid Action"}, status=status.HTTP_200_OK)
		
		return Response({"message": "Activation link is invalid."}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
	model = User
	permission_classes = [AllowAny]
	serializer_class = UserLoginSerializer
      
	def post(self, request, *args, **kwargs):
		serializer = self.serializer_class(data=request.data)
		try:
			serializer.is_valid(raise_exception=True)
			user = serializer.validated_data['user']
			otp_verification_url = reverse('otp_verification', args=[user.id])
			return Response({
			    "message": "A verification code is sent to your email",
			    "otp_verification_url": otp_verification_url
			}, status=status.HTTP_200_OK)
		
		except ValidationError as e:
			error_message = e.detail['message']
			return Response({"message": error_message}, status=status.HTTP_401_UNAUTHORIZED)
		
class OtpVerificationView(APIView):
	model = User
	permission_classes = [AllowAny]
	serializer_class = OtpCodeChecking

	def post(self, request, user_id, *args, **kwargs):
		user = User.objects.get(id=user_id)
		serializer = self.serializer_class(data=request.data, context={'user': user})
		try:
			serializer.is_valid(raise_exception=True)

			refresh = RefreshToken.for_user(user)
			access_token = str(refresh.access_token)
			refresh_token = str(refresh)

			response = Response({"access_token": access_token}, status=status.HTTP_200_OK)
			cookie_max_age = 3600 * 24
			response.set_cookie(
				'refresh_token',
			    refresh_token,
			    max_age=cookie_max_age,
			    httponly=True,
				secure=True
			)
			return response
		except ValidationError as e:
			error_message = e.detail['otp_code']
			return Response({"message": error_message}, status=status.HTTP_401_UNAUTHORIZED)


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

	def update(self, request, *args, **kwargs):
		response = super().update(request, *args, **kwargs)
		success_messages = getattr(request, 'success_message', None)
		if success_messages:
			response.data['success_message'] = success_messages
		return response


# reste a tester avec le front-end
class AcceptFriendRequestView(APIView):
    def post(self, request, *args, **kwargs):
        request_id = kwargs.get('request_id')
        try:
            friend_request = FriendRequest.objects.get(id=request_id)
            if friend_request.receiver != request.user:
                return Response({"error": "You are not authorized to accept this request."}, status=status.HTTP_403_FORBIDDEN)

            friend_request.is_accepted = True
            friend_request.save()

            friend_request.sender.friends.add(friend_request.receiver)
            friend_request.receiver.friends.add(friend_request.sender)

            return Response({"message": "Friend request accepted."}, status=status.HTTP_200_OK)
        except FriendRequest.DoesNotExist:
            return Response({"error": "Friend request not found."}, status=status.HTTP_404_NOT_FOUND)
		
class FriendRequestListView(APIView):
	def get(self, request, *args, **kwargs):
		received_requests = request.user.received_requests.filter(is_accepted=False)
		sent_requests = request.user.sent_requests.filter(is_accepted=False)

		return Response({
		    "received_requests": [{"id": req.id, "sender": req.sender.username} for req in received_requests],
		    "sent_requests": [{"id": req.id, "receiver": req.receiver.username} for req in sent_requests],
		})