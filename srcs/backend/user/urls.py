from . import views
from django.urls import path

urlpatterns = [

	# user endpoints
	path('list/', views.getListOfUsers, name="list_users"),
	path('friends/', views.getUserFriends, name="user_friends"),
	path('online/', views.getOnlineUsers, name='online_users'),
	path('search/', views.searchUser, name="search_user"),
	path('public/<int:pk>/', views.GetUserPublicInfos, name="user_public_infos"),
	path('private/', views.GetUserPrivateInfos, name="user_private_infos"),
	path('private/pk/', views.getUserPk, name="user_pk"),

	path('register/', views.CreateUserView.as_view(), name="register"),
	path('activate/<uidb64>/<token>/<action>/', views.ActivateLinkView.as_view(), name="activate_link"),
	
	path('profile/<int:pk>/', views.UserProfileView.as_view(), name="user_profile"),
	path('settings/<int:pk>/', views.UserSettingsView.as_view(), name="user_settings"),

	path('friend-requests/<int:pk>/', views.ListFriendRequestView.as_view(), name='list_friend_request'),
	path('friend-requests/accept/<int:request_id>/', views.AcceptFriendRequestView.as_view(), name='accept_friend_request'),

	# authentication endpoints
	path('check-auth/', views.check_auth, name="check_auth"),
	path('check-auth/token-refresh/', views.CookieTokenRefreshView.as_view(), name="cookie_token_refresh"),

	path('login/', views.UserLoginView.as_view(), name="login"),
	path('login/verify-otp/<int:user_id>/', views.OtpVerificationView.as_view(), name="otp_verification"),

	path('login42/auth_url/', views.get_42_auth_url, name='get_42_auth_url'),
	path('login42/callback/', views.login42, name='login42'),

	path('logout/', views.LogoutView.as_view(), name="logout"),
	
	path('login/token-refresh/', views.CookieTokenRefreshView.as_view(), name="cookie_token_refresh"),

]