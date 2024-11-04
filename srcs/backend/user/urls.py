from . import views
from django.urls import path

urlpatterns = [
	path('', views.user_index),
	path('signup/', views.CreateUserView.as_view(), name="signup"),
	path('signup/activate/<uidb64>/<token>/', views.ActivateAccountView.as_view(), name="signup_user_activate"),
	path('login/', views.UserLoginView.as_view(), name="login"),
	path('login/verify-otp/<int:user_id>/', views.OtpVerificationView.as_view(), name="otp_verification"),
	
	# path('login/', views.CookieTokenObtainPairView.as_view(), name="cookie_token_obtain_pair"),
    # path('login/refresh/', views.CookieTokenRefreshView.as_view(), name="cookie_token_refresh"),
	path('logout/', views.LogoutView.as_view(), name="logout")
]