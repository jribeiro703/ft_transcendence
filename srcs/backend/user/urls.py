from . import views
from django.urls import path

urlpatterns = [

	# public user endpoints
	path('list/', views.getListOfUsers, name="list_users"), #for developmet only
	path('search/<str:username>', views.searchUser, name="search_user"), #not used for the moment
	path('leaderboard/', views.getLeaderboard, name='get_leaderboard'),
	path('profile/<str:username>/', views.UserProfileView.as_view(), name="user_profile"),

	#ludo's endpoint
	path('get-id/', views.getUserIdByNickname, name="get_user_id"),

	# private user endpoints
	path('online/', views.getOnlineUsers, name="online_users"),
	path('private/pk/', views.getUserPk, name="user_pk"),
	path('settings/<int:pk>/', views.UserSettingsView.as_view(), name="user_settings"),
	path('friends/', views.getUserFriends, name="user_friends"),
	path('friend-requests/<int:pk>/', views.ListFriendRequestView.as_view(), name='list_friend_request'),
	path('friend-requests/accept/<int:request_id>/', views.AcceptFriendRequestView.as_view(), name='accept_friend_request'),

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