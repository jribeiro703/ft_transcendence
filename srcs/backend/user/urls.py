from . import views
from django.urls import path

urlpatterns = [
	path('', views.user_index),
	path('signup/', views.CreateUserView.as_view(), name="signup"),
	# path('signup/activate/<uidb64>/<token>/', views.ActivateAccountView.as_view(), name="signup-user-activate"),
	path('login/', views.CookieTokenObtainPairView.as_view(), name="cookie_token_obtain_pair"),
    path('login/refresh/', views.CookieTokenRefreshView.as_view(), name="cookie_token_refresh"),
	path('logout/', views.LogoutView.as_view(), name="logout")
]