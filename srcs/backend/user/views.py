from django.urls import reverse
from django.db.models import Q
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import timedelta
from game.models import Game
from .serializers import IndexSerializer, UserCreateSerializer, UserLoginSerializer, OtpCodeSerializer, UserSettingsSerializer
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
				return Response({"message": "Activation link has expired."}, status=status.HTTP_410_GONE)
			
			if action == 'verify_email' and user.new_email:
				user.email = user.new_email
				user.new_email = None
				user.save()
				return Response({"message": "Change email address successfully!"}, status=status.HTTP_200_OK)

			if action == 'activate_account':
				if user.is_active:
					return Response({"message": "Account is already active."}, status=status.HTTP_200_OK)
				user.is_active = True
				user.save()
				return Response({"message": "Account activated successfully!"}, status=status.HTTP_200_OK)
			return Response({"message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
		
		return Response({"message": "Activation link is invalid."}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
	model = User
	permission_classes = [AllowAny]
	serializer_class = UserLoginSerializer
      
	def post(self, request, *args, **kwargs):
		serializer = self.serializer_class(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.validated_data['user']
		otp_verification_url = reverse('otp_verification', args=[user.id])
		return Response({
		    "message": "A verification code is sent to your email",
		    "otp_verification_url": otp_verification_url
		}, status=status.HTTP_200_OK)
		
class OtpVerificationView(APIView):
	model = User
	permission_classes = [AllowAny]
	serializer_class = OtpCodeSerializer

	def post(self, request, user_id, *args, **kwargs):
		user = User.objects.get(id=user_id)
		serializer = self.serializer_class(data=request.data, context={'user': user})
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

class LogoutView(APIView):
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated, IsOwner]
	def post(self, request):
		try:
			refresh_token = request.COOKIES.get('refresh_token')
			token = RefreshToken(refresh_token)
			token.blacklist()
			return Response({"message": "Logout successfully !"}, status=status.HTTP_205_RESET_CONTENT)
		except Exception as e:
		    return Response({"message": "Logout failed."}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
	permission_classes = [AllowAny]

	def get(self, request, username, *args, **kwargs):
		try:
			user = User.objects.get(username=username)
		except User.DoesNotExist:
			return Response({"message": "Profile Not Found"}, status=status.HTTP_404_NOT_FOUND)

		total_matches = Game.objects.filter(
			Q(player_one=user) | Q(player_two=user)
		).count()
		won_matches = Game.objects.filter(winner=user).count()

		last_matches = Game.objects.filter(
			Q(player_one=user) | Q(player_two=user)
		).order_by('-created_at')[:5]

		match_history = []
		for match in last_matches:
			match_info = {
			    "date": match.created_at.strftime('%Y-%m-%d %H:%M:%S'),
			    "score": f"{match.score_one} - {match.score_two}",
			    "winner": match.winner.username
			}
			match_history.append(match_info)

		data = {
			"username": user.username,
			"alias": user.alias,
			"total_matches": total_matches,
			"won_matches": won_matches,
			"match_history": match_history
		}
		return Response(data, status=status.HTTP_200_OK)

class UserSettingsView(RetrieveUpdateDestroyAPIView):
	queryset = User.objects.all()
	serializer_class = UserSettingsSerializer
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated, IsOwner]
	
	def patch(self, request, *args, **kwargs):
		instance, success_messages = self.get_serializer().update(self.get_object(), request.data)
		serializer = self.get_serializer(instance)

		response_data = serializer.data
		response_data['messages'] = success_messages
		return Response(response_data)

class AcceptFriendRequestView(APIView):
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated, IsOwner]
    
	def post(self, request, *args, **kwargs):
		request_id = kwargs.get('request_id')
		try:
			friend_request = FriendRequest.objects.get(id=request_id)
			if friend_request.receiver != request.user:
				return Response({"message": "You are not authorized to accept this request."}, status=status.HTTP_403_FORBIDDEN)

			friend_request.is_accepted = True
			friend_request.save()
			friend_request.sender.friends.add(friend_request.receiver)
			friend_request.receiver.friends.add(friend_request.sender)

			return Response({"message": "Friend request accepted."}, status=status.HTTP_200_OK)
		except FriendRequest.DoesNotExist:
			return Response({"message": "Friend request not found."}, status=status.HTTP_404_NOT_FOUND)
		
class ListFriendRequestView(APIView):
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated, IsOwner]
	
	def get(self, request, *args, **kwargs):
		user = User.objects.get(pk=kwargs['pk'])
		received_requests = user.received_requests.filter(is_accepted=False)
		sent_requests = user.sent_requests.filter(is_accepted=False)

		return Response({
		    "received_requests": [{"id": req.id, "sender": req.sender.username} for req in received_requests],
		    "sent_requests": [{"id": req.id, "receiver": req.receiver.username} for req in sent_requests],
		})