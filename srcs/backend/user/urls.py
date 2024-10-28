from . import views
from django.urls import path

urlpatterns = [
	path('', views.user_index),
	path('signup/', views.CreateUserView.as_view(), name="signup"),
	# path('login/', views.LoginView.as_view())
]