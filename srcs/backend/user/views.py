import requests
from django.urls import reverse
from django.db.models import Q
from django.views import View
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile
from rest_framework import status, serializers, exceptions
from rest_framework.exceptions import NotAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from datetime import timedelta
from game.models import Game
from transcendence import settings
from .serializers import UserCreateSerializer, OtpCodeSerializer, UserSettingsSerializer, UserPrivateInfosSerializer, UserPublicInfosSerializer
from .models import User, FriendRequest, GameRequest
from .utils import send_2FA_mail, generate_tokens_for_user, set_refresh_token_in_cookies, get_user_matchs_infos
import json
import logging

logger = logging.getLogger(__name__)

# -----------------------------------USED ENDPOINTS FOR LIVECHAT--------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserIdByNickname(request):
	"""Get user ID from nickname"""
	try:
		nickname = request.query_params.get('nickname')
		if not nickname:
			return Response(
				{"message": "Nickname parameter is required"}, 
				status=status.HTTP_400_BAD_REQUEST
			)

		user = User.objects.filter(username=nickname).first()
		if not user:
			return Response(
				{"message": "User not found"}, 
				status=status.HTTP_404_NOT_FOUND
			)

		return Response({"id": user.id}, status=status.HTTP_200_OK)

	except Exception as e:
		return Response(
			{"message": f"Error fetching user ID: {str(e)}"}, 
			status=status.HTTP_500_INTERNAL_SERVER_ERROR
		)

class UserProfileViewId(APIView):
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

			# match_info = {
				# "date": match.created_at.strftime('%Y-%m-%d %H:%M:%S'),
				# "game_type"
				# "difficulty"
				# "powerup"
				# "level"
				# "player_one"
				# "score": f"{match.score_one} - {match.score_two}",
				# "player_two"
				# "winner": match.winner.username
			# }

			match_info = {
				"date": match.created_at.strftime('%Y-%m-%d %H:%M:%S'),
				"score": f"{match.score_one} - {match.score_two}",
				"winner": match.winner.username if match.winner else "No Winner"
			}
			match_history.append(match_info)

		is_friend = False
		is_blocked = False
		if request.user.is_authenticated:
			is_friend = request.user.friends.filter(id=user.id).exists()
			is_blocked = request.user.blocklist.filter(id=user.id).exists()

		data = {
			"id": user.id,
			"username": user.username,
			"avatar": user.avatar.url,
			"alias": user.alias,
			"is_online": user.is_online,
			"total_matches": total_matches,
			"won_matches": won_matches,
			"match_history": match_history,
			"is_friend": is_friend,
			"is_blocked": is_blocked
		}
		return Response(data, status=status.HTTP_200_OK)

# -------------------------------GAME ENDPOINTS--------------------------------	

class ListGameInvitationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=kwargs['pk'])
        received_requests = GameRequest.objects.filter(receiver=user, is_accepted=False)
        sent_requests = GameRequest.objects.filter(sender=user, is_accepted=False)

        return Response({
            "received_requests": [{"id": req.id, "sender": req.sender.username, "room": req.room} for req in received_requests],
            "sent_requests": [{"id": req.id, "receiver": req.receiver.username, "room": req.room} for req in sent_requests],
        })

class SendGameInvitationView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, *args, **kwargs):
		user_id = kwargs.get('user_id')
		sender = request.user
		receiver = get_object_or_404(User, id=user_id)
		room_name = request.data.get('roomName')
		
		if not room_name:
			return Response({"message:" "Room name is required"}, status=status.HTTP_400_BAD_REQUEST)

		if GameRequest.objects.filter(sender=sender, receiver=receiver).exists():
			return Response({"message": f"You have already sent an invitation for a match to {receiver.username}"}, status=status.HTTP_400_BAD_REQUEST)
		
		GameRequest.objects.create(sender=sender, receiver=receiver, room=room_name)
		return Response({"message": f" Invitation for a match sent to {receiver.username} in {room_name}"}, status=status.HTTP_200_OK)


class AcceptGameInvitationView(APIView):
	
	def post(self, request, *args, **kwargs):
		request_id = kwargs.get('request_id')
		try:
			game_request = GameRequest.objects.get(id=request_id)
			if game_request.receiver != request.user:
				return Response({"message": "You are not authorized to accept this request."}, status=status.HTTP_403_FORBIDDEN)

			game_request.delete()

			return Response({"message": "Game invitation accepted."}, status=status.HTTP_200_OK)
		except GameRequest.DoesNotExist:
			return Response({"message": "Game invitation not found."}, status=status.HTTP_404_NOT_FOUND)

class DenyGameInvitationView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, *args, **kwargs):
		request_id = kwargs.get('request_id')
		try:
			game_request = GameRequest.objects.get(id=request_id)
			if game_request.receiver != request.user and game_request.sender != request.user:
				return Response({"message": "You are not authorized to deny this request."}, status=status.HTTP_403_FORBIDDEN)

			game_request.delete()

			return Response({"message": "game request denied and deleted."}, status=status.HTTP_200_OK)
		except GameRequest.DoesNotExist:
			return Response({"message": "game request not found."}, status=status.HTTP_404_NOT_FOUND)

# ------------------------------FRIENDS ENDPOINTS--------------------------------	

class AcceptFriendRequestView(APIView):
	
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

class DenyFriendRequestView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, *args, **kwargs):
		request_id = kwargs.get('request_id')
		try:
			friend_request = FriendRequest.objects.get(id=request_id)
			if friend_request.receiver != request.user and friend_request.sender != request.user:
				return Response({"message": "You are not authorized to deny this request."}, status=status.HTTP_403_FORBIDDEN)

			friend_request.delete()

			return Response({"message": "Friend request denied and deleted."}, status=status.HTTP_200_OK)
		except FriendRequest.DoesNotExist:
			return Response({"message": "Friend request not found."}, status=status.HTTP_404_NOT_FOUND)

class ListFriendRequestView(APIView):
	
	def get(self, request, *args, **kwargs):
		user = User.objects.get(pk=kwargs['pk'])
		received_requests = user.received_requests.filter(is_accepted=False)
		sent_requests = user.sent_requests.filter(is_accepted=False)

		return Response({
			"received_requests": [{"id": req.id, "sender": req.sender.username} for req in received_requests],
			"sent_requests": [{"id": req.id, "receiver": req.receiver.username} for req in sent_requests],
			})

class SendFriendRequestView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, *args, **kwargs):
		user_id = kwargs.get('user_id')
		sender = request.user
		receiver = get_object_or_404(User, id=user_id)

		# # Log the incoming data
		# logger.info(f"Friend request data received: sender={sender.username}, receiver_id={receiver.username}")

		if sender.friends.filter(id=receiver.id).exists():
			return Response({"message": f"{receiver.username} is already in your friends list"}, status=status.HTTP_400_BAD_REQUEST)
		
		if FriendRequest.objects.filter(sender=sender, receiver=receiver).exists():
			return Response({"message": f"You have already sent a friend request to {receiver.username}"}, status=status.HTTP_400_BAD_REQUEST)
		
		FriendRequest.objects.create(sender=sender, receiver=receiver)
		return Response({"message": f"Friend request sent to {receiver.username}"}, status=status.HTTP_200_OK)

class IsFriendView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, *args, **kwargs):
		user_id = kwargs.get('user_id')
		user = request.user
		try:
			friend = User.objects.get(id=user_id)
			is_friend = user.friends.filter(id=friend.id).exists()
			return Response({"is_friend": is_friend}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class RemoveFriendView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, *args, **kwargs):
		user_id = kwargs.get('user_id')
		user = request.user
		try:
			friend = User.objects.get(id=user_id)
			user.remove_friend(friend)
			return Response({"message": f"Friend {friend.username} removed successfully."}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class IsBlockedViewId(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, *args, **kwargs):
		user_id = kwargs.get('user_id')
		user = request.user
		try:
			blocked_user = User.objects.get(id=user_id)
			is_blocked = user.blocklist.filter(id=blocked_user.id).exists()
			return Response({"is_blocked": is_blocked}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class IsBlockedViewNick(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, *args, **kwargs):
		nickname = kwargs.get('nickname')
		logger.info(nickname)
		user = request.user
		try:
			blocked_user = User.objects.get(username=nickname)
			is_blocked = user.blocklist.filter(id=blocked_user.id).exists()
			return Response({"is_blocked": is_blocked}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class BlockUserView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, *args, **kwargs):
		user_id = kwargs.get('user_id')
		user = request.user
		try:
			user_to_block = User.objects.get(id=user_id)
			user.block_user(user_to_block)
			return Response({"message": f"User {user_to_block.username} blocked successfully."}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class UnblockUserView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, *args, **kwargs):
		user_id = kwargs.get('user_id')
		user = request.user
		try:
			user_to_unblock = User.objects.get(id=user_id)
			user.unblock_user(user_to_unblock)
			return Response({"message": f"User {user_to_unblock.username} unblocked successfully."}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# -----------------------------------GET USER INFOS ENDPOINTS--------------------------------

@api_view(['GET'])
@permission_classes([AllowAny])
def getListOfUsers(request):
	users = User.objects.all()
	serializer = UserPublicInfosSerializer(users, many=True)
	return Response(serializer.data, status=status.HTTP_200_OK)	

@api_view(['GET'])
@permission_classes([AllowAny])
def searchUser(request, username):
	try:
		user = User.objects.get(username=username)
	except User.DoesNotExist:
		return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
	except Exception as e:
		return Response({"message": "Error fetching user public data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	serializer = UserPublicInfosSerializer(user)
	return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetUserPrivateInfos(request):
	try:
		serializer = UserPrivateInfosSerializer(request.user)
	except Exception as e:
		return Response({"message": "Error fetching user private data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])	
@permission_classes([AllowAny])
def getLeaderboard(request):
	try:
		leaderboard = {}
		users = User.objects.filter(is_staff=False)
		for user in users:
			matchs = get_user_matchs_infos(user)
			username = user.username
			avatar = user.avatar.url
			leaderboard[username] = { "username": username, "avatar": avatar, "matchs": matchs}
		return Response(leaderboard, status=status.HTTP_200_OK)
	except Exception as e:
		return Response({"message": "Error fetching leaderboard"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserFriends(request):
	try:
		if not isinstance(request.user, User):
			return Response(
				{"message": "Invalid user type"}, 
				status=status.HTTP_401_UNAUTHORIZED
			)

		friends = request.user.friends.all()
		friends_data = []

		for friend in friends:
			user_profile_view = UserProfileViewId()
			response = user_profile_view.get(request, pk=friend.id)
			if response.status_code == status.HTTP_200_OK:
				friends_data.append(response.data)
			else:
				logger.error(f"Error fetching profile for friend {friend.username}")

		return Response(friends_data, status=status.HTTP_200_OK)

	except Exception as e:
		logger.error(f"Error fetching friends list: {str(e)}")
		return Response(
			{"message": "Error fetching friends list"}, 
			status=status.HTTP_500_INTERNAL_SERVER_ERROR
		)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOnlineUsers(request):
	try:
		# Ensure user is a proper User instance
		if not isinstance(request.user, User):
			return Response(
				{"message": "Invalid user type"}, 
				status=status.HTTP_401_UNAUTHORIZED
			)

		online_users = User.objects.filter(is_online=True).exclude(id=request.user.id)
		online_users_data = []

		for user in online_users:
			user_profile_view = UserProfileViewId()
			response = user_profile_view.get(request, pk=user.id)
			if response.status_code == status.HTTP_200_OK:
				online_users_data.append(response.data)
			else:
				logger.error(f"Error fetching profile for online user {user.username}")

		return Response(online_users_data, status=status.HTTP_200_OK)

	except Exception as e:
		logger.error(f"Error fetching online users: {str(e)}")
		return Response({"message": "Error fetching online users"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSelfUsername(request):
	try:
		user = request.user
	except Exception as e:
		return Response({"message": "Error fetching self username"}, status=status.HTTP_500_INTERNAL_SERVER)
	return Response({"username": user.username}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserPk(request):
	try:
		user = request.user
	except Exception as e:
		return Response({"message": "Error fetching self pk"}, status=status.HTTP_500_INTERNAL_SERVER)
	return Response({"pk": user.id}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserIdByNickname(request):
	"""Get user ID from nickname"""
	try:
		nickname = request.query_params.get('nickname')
		if not nickname:
			return Response(
				{"message": "Nickname parameter is required"}, 
				status=status.HTTP_400_BAD_REQUEST
			)

		user = User.objects.filter(username=nickname).first()
		if not user:
			return Response(
				{"message": "User not found"}, 
				status=status.HTTP_404_NOT_FOUND
			)

		return Response({"id": user.id}, status=status.HTTP_200_OK)

	except Exception as e:
		return Response(
			{"message": f"Error fetching user ID: {str(e)}"}, 
			status=status.HTTP_500_INTERNAL_SERVER_ERROR
		)
	
# ------------------------------REGISTER USER ENDPOINTS--------------------------------	

class CreateUserView(CreateAPIView):
	queryset = User.objects.all()
	permission_classes = [AllowAny]
	serializer_class = UserCreateSerializer
	
	def create(self, request, *args, **kwargs):
		try:
			response = super().create(request, *args, **kwargs)
			return Response({
				"message": "Account created successfully. Please check your email to activate your account."
			}, status=status.HTTP_201_CREATED)
		
		except serializers.ValidationError as e:
			# print("create user view error: ", e)
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

# ------------------------------USER PROFILE ENDPOINTS--------------------------------	

class UserProfileView(APIView):
	permission_classes = [AllowAny]

	def get(self, request, username, *args, **kwargs):
		try:
			user = User.objects.get(username=username)
		except User.DoesNotExist:
			return Response({"message": "Profile Not Found"}, status=status.HTTP_404_NOT_FOUND)

		total_matches = Game.objects.filter(Q(player_one=user) | Q(player_two=user)).count()
		won_matches = Game.objects.filter(winner=user).count()
		matches_played = Game.objects.filter(Q(player_one=user) | Q(player_two=user)).order_by('-created_at')

		match_history = []
		for match in matches_played:
			if user.pk == match.player_one.pk:
				me = {
					"score": match.score_one,					
				}
				enemy = {
					"avatar": match.player_two.avatar.url,
					"username": match.player_two.username if match.player_two else None,
					"score": match.score_two,
				}
			else:
				me = {
					"score": match.score_two
				}
				enemy = {
					"avatar": match.player_one.avatar.url,
					"username": match.player_one.username if match.player_one else None,
					"score": match.score_one,					
				}

			match_info = {
				"date": match.created_at.strftime('%Y-%m-%d'),
				"me": {
					"score": me["score"],
				},
				"enemy": {
					"avatar": enemy["avatar"],
					"username": enemy["username"],
					"score": enemy["score"],
				},
				"winner": match.winner.username if match.winner else None
			}
			match_history.append(match_info)

		is_friend = False
		is_blocked = False
		if request.user.is_authenticated:
			is_friend = request.user.friends.filter(id=user.id).exists()
			is_blocked = request.user.blocklist.filter(id=user.id).exists()

		data = {
			"id": user.id,
			"username": user.username,
			"avatar": user.avatar.url,
			"alias": user.alias,
			"is_online": user.is_online,
			"total_matches": total_matches,
			"won_matches": won_matches,
			"match_history": match_history,
			"is_friend": is_friend,
			"is_blocked": is_blocked
		}
		return Response(data, status=status.HTTP_200_OK)

# ------------------------------USER SETTINGS ENDPOINTS--------------------------------	

class UserSettingsView(RetrieveUpdateDestroyAPIView):
	queryset = User.objects.all()
	serializer_class = UserSettingsSerializer
	permission_classes = [IsAuthenticated]

	def patch(self, request, *args, **kwargs):
		try:
			instance, message = self.get_serializer().update(self.get_object(), request.data)
			return Response(message, status=status.HTTP_200_OK)
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

# -----------------------------------CHECK AUTHENTICATION ENDPOINTS--------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
	if not request.user.is_authenticated:
		raise NotAuthenticated(detail="User is not authenticated")
	return Response({
		"message": "User is authenticated"
		}, status=status.HTTP_200_OK)

class CookieTokenRefreshView(APIView):
	permission_classes = [AllowAny]

	def get(self, request, *args, **kwargs):
		refresh_token = request.COOKIES.get('refresh_token')
		if not refresh_token:
			return Response({'message': 'Refresh token not found in cookies.'}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			refresh = RefreshToken(refresh_token)
			new_access_token = str(refresh.access_token)
			response = Response({'access_token': new_access_token}, status=status.HTTP_200_OK)
			set_refresh_token_in_cookies(response, refresh_token)
			return response

		except TokenError as e:
			return Response({'message': 'Invalid refresh token.'}, status=status.HTTP_400_BAD_REQUEST)

		except Exception as e:
			return Response({'message': 'An error occurred while refreshing the token.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ------------------------------LOGIN ENDPOINTS--------------------------------	

class UserLoginView(APIView):
	model = User
	permission_classes = [AllowAny]

	def post(self, request, *args, **kwargs):
		username = request.data.get('username')
		password = request.data.get('password')

		if not username or not password:
			return Response({"message": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
		
		user = User.objects.filter(username=username).first()
		if not user:
			return Response({"message": "User with this username doesn't exist"}, status=status.HTTP_401_UNAUTHORIZED)
		
		is_authenticated = authenticate(username=username, password=password)
		if is_authenticated is None:
			return Response({"message": "Invalid Password"}, status=status.HTTP_401_UNAUTHORIZED)
		
		try:
			send_2FA_mail(user)
		except exceptions.APIException as e:
			return Response(e.detail, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		
		user.is_online = True
		user.last_activity = timezone.now()
		user.save()
		
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
		
		access_token, refresh_token = generate_tokens_for_user(user)
		response = Response({
			"message": "Code is valid, you are now connected !",
			"access_token": access_token,
			},
			status=status.HTTP_200_OK
		)
		response['HX-Trigger'] = json.dumps({
			'otpVerificationSuccess': {
				'reload_chat': True
			}
		})
		set_refresh_token_in_cookies(response, refresh_token)
		user.is_online = True
		user.save()
		return response

# ------------------------------LOGIN 42 ENDPOINTS--------------------------------	

@api_view(['GET'])
@permission_classes([AllowAny])
def get_42_auth_url(request):
	try:
		client_id = settings.FT_CLIENT_ID	
		# redirect_uri = settings.FT_REDIRECT_URI
		domain = request.get_host().split(':')[0]  # Extract only the domain
		redirect_uri = f"{request.scheme}://{domain}:8081/user/login42/callback/"
		auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
		return Response({"auth_url": auth_url}, status=status.HTTP_200_OK)
	except Exception as e:
		return Response({"message": "failed to get 42 auth url"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def login42(request):
	code = request.query_params.get('code')
	token_url = "https://api.intra.42.fr/oauth/token"
	client_id = settings.FT_CLIENT_ID
	client_secret = settings.FT_CLIENT_SECRET
	redirect_uri = settings.FT_REDIRECT_URI
	domain = request.get_host().split(':')[0]  # Extract only the domain
	redirect_uri = f"{request.scheme}://{domain}:8081/user/login42/callback/"
	redirect_home = f"{request.scheme}://{domain}:8081/#home"

	data = {
		"grant_type": "authorization_code",
		"client_id": client_id,
		"client_secret": client_secret,
		"code": code,
		"redirect_uri": redirect_uri,
	}

	try:                                        
		response = requests.post(token_url, data=data)
		token_data = response.json()

		if "access_token" not in token_data:
			# print("login42 view :error while getting access token")
			response = redirect(redirect_home)
			return response
		
		user_info = requests.get('https://api.intra.42.fr/v2/me', 
			headers={'Authorization': f"Bearer {token_data['access_token']}"})
		user_data = user_info.json()

		user, created = User.objects.get_or_create(
			username=user_data['login'],
			email=user_data['email'],
			defaults={
				'username': user_data['login'],
				'email': user_data['email'],
				'avatar': None,
				'is_42_user': True,
				'is_active': True,
			}
		)
		
		avatar_url = user_data['image']['versions']['small']
		avatar_response = requests.get(avatar_url)
		if (avatar_response.status_code == 200):
			filename = f"avatar_{user_data['login']}.jpg"
			if not user.avatar:
				user.avatar.save(filename, ContentFile(avatar_response.content), save=True)

		response = redirect(redirect_home)
		access_token, refresh_token = generate_tokens_for_user(user)
		set_refresh_token_in_cookies(response, refresh_token)
		# print("set tokens in cookies and redirect to user page")
		return response
	
	except Exception as e:
		# print("login42 exception error: ", e)
		response = redirect(redirect_uri)
		return response

# ------------------------------LOGOUT ENDPOINTS--------------------------------	

class LogoutView(APIView):

	permission_classes = [AllowAny]

	def post(self, request):
		if request.user.is_authenticated:
			request.user.is_online = False
			request.user.save()
		try:
			refresh_token = request.COOKIES.get('refresh_token')
			if not refresh_token:
				response = Response({"message": "Logout successfully"}, status=status.HTTP_200_OK)
				response.delete_cookie('csrftoken')

				return response
			
			token = RefreshToken(refresh_token)
			try:
				user = User.objects.get(id=token.payload.get('user_id'))
				user.is_online = False
				user.save()
			except User.DoesNotExist:
				pass

			token.blacklist()
			response = Response({"message": "Logout successfully"}, status=status.HTTP_200_OK)
			response.delete_cookie('refresh_token')
			response.delete_cookie('csrftoken')

			return response

		except Exception as e:
			return Response({"message": "Logout failed."}, status=status.HTTP_400_BAD_REQUEST)

