from django.urls import reverse
from django.db.models import Q
from django.http import HttpResponse
from django.views import View
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.shortcuts import get_object_or_404
from rest_framework import status, serializers, exceptions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import timedelta
from game.models import Game
from .serializers import IndexSerializer, UserCreateSerializer, OtpCodeSerializer, UserSettingsSerializer
from .models import User, FriendRequest
from .permissions import IsOwner
from .utils import send_2FA_mail

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
		try:
			super().create(request, *args, **kwargs)
			return Response({
				"message": "Account created successfully. Please check your email to activate your account."
			}, status=status.HTTP_201_CREATED)
		
		except serializers.ValidationError as e:
			return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
		except exceptions.APIException as e:
			return Response(e.detail, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ActivateLinkView(View):
	permission_classes = [AllowAny]
	
	def get(self, request, uidb64, token, action):

		try:
			uid = force_str(urlsafe_base64_decode(uidb64))
			user = get_object_or_404(User, pk=uid)
		except (TypeError, ValueError, OverflowError, User.DoesNotExist):
			return render(request, 'activation_failed.html', {
			    'message': "Activation link is invalid."
			})

		if not default_token_generator.check_token(user, token):
			return render(request, 'activation_failed.html', {
				'message': "Activation link is invalid or has expired."
			})

		expiration_duration = timedelta(hours=24)
		if timezone.now() - user.email_sent_at > expiration_duration:
			user.delete()
			return render(request, 'activation_failed.html', {
				'message': "Activation link has expired."
			})

		print("user new_email:", user.new_email)

		if action == 'verify_email' and user.new_email:
			user.email = user.new_email
			user.new_email = None
			user.save()
			return render(request, 'activation_success.html', {
				'message': "Your email address has been changed successfully."
			})

		if action == 'activate_account':
			if user.is_active:
				return render(request, 'activation_success.html', {
					'message': "Your account is already active."
				})
			user.is_active = True
			user.save()
			return render(request, 'activation_success.html', {
				'message': "Your account has been activated successfully!"
			})

		return render(request, 'activation_failed.html', {
			'message': "An unknown error occurred."
		})


class UserLoginView(APIView):
	model = User
	permission_classes = [AllowAny]
      
	def post(self, request, *args, **kwargs):
		username = request.data.get('username')
		password = request.data.get('password')

		if not username or not password:
			return Response({"message": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
		user = User.objects.filter(username=username).first()
		if not user or user.is_staff:
			return Response({"message": "User with this username doesn't exist"}, status=status.HTTP_401_UNAUTHORIZED)
		is_authenticated = authenticate(username=username, password=password)
		if is_authenticated is None:
			return Response({"message": "Invalid Password"}, status=status.HTTP_401_UNAUTHORIZED)
		
		try:
			send_2FA_mail(user)
		except exceptions.APIException as e:
			return Response(e.detail, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		
		return Response({
			    "message": "A verification code is sent to your email",
			    "otp_verification_url": reverse('otp_verification', args=[user.id])
			}, status=status.HTTP_200_OK)

class OtpVerificationView(APIView):
	model = User
	permission_classes = [AllowAny]
	serializer_class = OtpCodeSerializer

	def post(self, request, user_id, *args, **kwargs):
		user = User.objects.get(id=user_id)
		try:
			serializer = self.serializer_class(data=request.data, context={'user': user})
			serializer.is_valid(raise_exception=True)

		except serializers.ValidationError as e:
			return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
		except exceptions.NotAuthenticated as e:
			return Response(e.detail, status=status.HTTP_401_UNAUTHORIZED)
		
		refresh = RefreshToken.for_user(user)
		access_token = str(refresh.access_token)
		refresh_token = str(refresh)

		response = Response({
			"message": "Code is valid, you are now connected !",
			"access_token": access_token
			},
			status=status.HTTP_200_OK
		)
		cookie_max_age = 3600 * 24
		response.set_cookie(
			'refresh_token',
		    refresh_token,
		    max_age=cookie_max_age,
		    httponly=True,
			secure=True
		)
		return response

class CookieTokenRefreshView(APIView):
	authentication_classes = [JWTAuthentication]

	def get(self, request, *args, **kwargs):
		refresh_token = request.COOKIES.get('refresh_token')
		if not refresh_token:
			return Response({'message': 'Refresh token not found in cookies.'}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			refresh = RefreshToken(refresh_token)
			new_access_token = str(refresh.access_token)
			return Response({'access_token': new_access_token}, status=status.HTTP_200_OK)

		except TokenError as e:
			return Response({'message': 'Invalid refresh token.'}, status=status.HTTP_400_BAD_REQUEST)

		except Exception as e:
			return Response({'message': 'An error occurred while refreshing the token.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
	authentication_classes = [JWTAuthentication]

	def post(self, request):
		try:
			refresh_token = request.COOKIES.get('refresh_token')
			token = RefreshToken(refresh_token)
			token.blacklist()
			response = Response({
				"message": "Logout successfully !",
				"access_token": "",
				}, status=status.HTTP_205_RESET_CONTENT)
			response.delete_cookie('refresh_token')
			return response

		except exceptions.AuthenticationFailed:
			return Response({"message": "Authentication failed."}, status=status.HTTP_401_UNAUTHORIZED)
		except exceptions.PermissionDenied:
			return Response({"message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
		except Exception as e:
		    return Response({"message": "Logout failed."}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
	permission_classes = [AllowAny]

	def get(self, request, pk, *args, **kwargs):
		try:
			user = User.objects.get(id=pk)
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
			"avatar": user.avatar.url,
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

	def patch(self, request, *args, **kwargs):
		try:
			instance, success_messages = self.get_serializer().update(self.get_object(), request.data)
			return Response(success_messages, status=status.HTTP_200_OK)
		except serializers.ValidationError as e:
			return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
		except exceptions.APIException as e:
			return Response(e.detail, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	
	def delete(self, request, *args, **kwargs):
		try:
			refresh_token = request.COOKIES.get('refresh_token')
			token = RefreshToken(refresh_token)
			token.blacklist()
			response = Response({
				"message": "Your account has been successfully deleted.",
				"access_token": "",
				}, status=status.HTTP_205_RESET_CONTENT)
			response.delete_cookie('refresh_token')
			super().delete(request, *args, **kwargs)
			return response
		except Exception as e:
		    return Response({"message": "An unknown error occured, failed to delete account."}, status=status.HTTP_400_BAD_REQUEST)


class AcceptFriendRequestView(APIView):
	authentication_classes = [JWTAuthentication]
    
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
	
	def get(self, request, *args, **kwargs):
		user = User.objects.get(pk=kwargs['pk'])
		received_requests = user.received_requests.filter(is_accepted=False)
		sent_requests = user.sent_requests.filter(is_accepted=False)

		return Response({
		    "received_requests": [{"id": req.id, "sender": req.sender.username} for req in received_requests],
		    "sent_requests": [{"id": req.id, "receiver": req.receiver.username} for req in sent_requests],
		})