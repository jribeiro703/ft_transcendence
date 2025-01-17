from . import views
from django.urls import path

urlpatterns = [

	# public user endpoints
	path('list/', views.getListOfUsers, name="list_users"), #for developmet only
	path('search/<str:username>/', views.searchUser, name="search_user"), #data for search or mouse hover on match history avatar
	path('profile/<str:username>/', views.UserProfileView.as_view(), name="user_profile"), #data for profile page
	path('leaderboard/', views.getLeaderboard, name='get_leaderboard'),

	#used endpoints for livechat
	path('get-id/', views.getUserIdByNickname, name="get_user_id"),
	path('profile-id/<int:pk>/', views.UserProfileViewId.as_view(), name="user_profile_id"),
	path('game/invite/<int:user_id>/', views.SendGameInvitationView.as_view(), name='send_invitation'),
	path('game/<int:pk>/', views.ListGameInvitationsView.as_view(), name='list_invitations_request'),
	path('game/accept/<int:request_id>/', views.AcceptGameInvitationView.as_view(), name='accept_invitation_request'),
	path('game/deny/<int:request_id>/', views.DenyGameInvitationView.as_view(), name='deny_invitation_request'),

	#friends's endpoints
	path('friends/', views.getUserFriends, name="user_friends"),
	path('friends/<int:pk>/', views.ListFriendRequestView.as_view(), name='list_friend_request'),
	path('friends/accept/<int:request_id>/', views.AcceptFriendRequestView.as_view(), name='accept_friend_request'),
	path('friends/deny/<int:request_id>/', views.DenyFriendRequestView.as_view(), name='deny_friend_request'),
	path('friends/add/<int:user_id>/', views.SendFriendRequestView.as_view(), name='send_friend_request'),
	path('friends/remove/<int:user_id>/', views.RemoveFriendView.as_view(), name='remove_friend'),
	path('friends/check/<int:user_id>/', views.IsFriendView.as_view(), name='is_friend'),
	path('block/check/id/<int:user_id>/', views.IsBlockedViewId.as_view(), name='is_blocked_id'),
	path('block/check/nickname/<str:nickname>/', views.IsBlockedViewNick.as_view(), name='is_blocked_nickname'),
	path('block/add/<int:user_id>/', views.BlockUserView.as_view(), name='block_user'),
	path('block/remove/<int:user_id>/', views.UnblockUserView.as_view(), name='unblock_user'),

	# private user endpoints
	path('online/', views.getOnlineUsers, name="online_users"),
	path('self-username/', views.getSelfUsername, name="self_username"),
	path('private/', views.GetUserPrivateInfos, name="user_private_infos"), #get user private infos
	path('private/pk/', views.getUserPk, name="user_pk"),
	path('settings/<int:pk>/', views.UserSettingsView.as_view(), name="user_settings"),


	# authentication endpoints
	path('register/', views.CreateUserView.as_view(), name="register"),
	path('activate/<uidb64>/<token>/<action>/', views.ActivateLinkView.as_view(), name="activate_link"),
	path('check-auth/', views.check_auth, name="check_auth"),
	path('check-auth/token-refresh/', views.CookieTokenRefreshView.as_view(), name="cookie_token_refresh"),
	path('login/', views.UserLoginView.as_view(), name="login"),
	path('login/verify-otp/<int:user_id>/', views.OtpVerificationView.as_view(), name="otp_verification"),
	path('login42/auth_url/', views.get_42_auth_url, name='get_42_auth_url'),
	path('login42/callback/', views.login42, name='login42'),
	path('logout/', views.LogoutView.as_view(), name="logout"),

]