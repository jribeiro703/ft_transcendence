from . import views
from django.urls import path

urlpatterns = [
	path('', views.user_index, name="list_users"),
	path('signup/', views.CreateUserView.as_view(), name="signup"),
	path('signup/activate/<uidb64>/<token>/', views.ActivateAccountView.as_view(), name="account_activate"),
	path('login/', views.UserLoginView.as_view(), name="login"),
	path('login/verify-otp/<int:user_id>/', views.OtpVerificationView.as_view(), name="otp_verification"),
	path('logout/', views.LogoutView.as_view(), name="logout"),
	
	path('detail/<int:pk>', views.UserRetrieveUpdateDestroyView.as_view(), name="user_detail"),
	path('friend-requests/', views.FriendRequestListView.as_view(), name='friend_request_list'),
    path('friend-requests/accept/<int:request_id>/', views.AcceptFriendRequestView.as_view(), name='accept_friend_request'),
]