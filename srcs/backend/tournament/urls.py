from . import views
from django.urls import path

urlpatterns = [
	path('', views.tournament_index),
]
