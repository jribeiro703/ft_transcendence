from . import views
from django.urls import path

urlpatterns = [

	# for auth
	path('login/', views.UserLoginView.as_view(), name="login"),
	path('login/token-refresh/', views.CookieTokenRefreshView.as_view(), name="cookie_token_refresh"),
	path('login/verify-otp/<int:user_id>/', views.OtpVerificationView.as_view(), name="otp_verification"),
	path('register/', views.CreateUserView.as_view(), name="register"),
	path('activate/<uidb64>/<token>/<action>/', views.ActivateLinkView.as_view(), name="activate_link"),
	path('logout/', views.LogoutView.as_view(), name="logout"),
	
	#for profile (public)
	path('', views.user_index, name="list_users"),
	path('profile/<int:pk>/', views.UserProfileView.as_view(), name="user_profile"),

	# for settings (private)
	path('settings/<int:pk>/', views.UserSettingsView.as_view(), name="user_settings"),

	# for friends (private)
	path('friend-requests/<int:pk>/', views.ListFriendRequestView.as_view(), name='list_friend_request'),
    path('friend-requests/accept/<int:request_id>/', views.AcceptFriendRequestView.as_view(), name='accept_friend_request'),
	
]