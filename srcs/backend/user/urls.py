from . import views
from django.urls import path

urlpatterns = [
	path('', views.index, name='home'),
	path('login/', views.CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', views.CookieTokenRefreshView.as_view(), name='token_refresh'),
	path('logout/', views.LogoutView.as_view(), name='logout'),
]