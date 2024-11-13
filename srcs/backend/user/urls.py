from . import views
from django.urls import path

urlpatterns = [

	#for list alls users
	path('', views.user_index, name="list_users"),

	# for auth
	path('login/', views.UserLoginView.as_view(), name="login"),
	path('login/verify-otp/<int:user_id>/', views.OtpVerificationView.as_view(), name="otp_verification"),
	path('register/', views.CreateUserView.as_view(), name="register"),
	path('activate/<uidb64>/<token>/<action>/', views.ActivateLinkView.as_view(), name="activate_link"),
	path('logout/', views.LogoutView.as_view(), name="logout"),
	
	#for profile
	# path('profile/stats/', views.ProfileStatsView.as_view(), name="user_stats"),
	# path('profile/match-history/', views.MatchHistoryView.as_view(), name="user_match_history"),

	#for settings
	# path('settings/<int:pk>', views.UserSettingsView.as_view(), name="user_settings"),

	# for friends
	# path('friend-requests/', views.FriendRequestListView.as_view(), name='friend_request_list'),
    # path('friend-requests/accept/<int:request_id>/', views.AcceptFriendRequestView.as_view(), name='accept_friend_request'),
	
]