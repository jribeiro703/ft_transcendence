from . import views
from django.urls import path

urlpatterns = [
	path('', views.game_index)
	# path('create/', views.GameCreateView.as_view(), name="game_create"),
]
