from django.urls import path
from .views.tournament_creation import (
	CreateTournamentView,
	FetchPlayersView,
	AddPlayersToTournamentView,
)
from .views.tournament_progress import TournamentProgressView
from .views.tournament_announcement import TournamentAnnouncementView
from .views.tournament_matchmaking import PerformMatchmakingView 

urlpatterns = [
	path('', CreateTournamentView.as_view(), name='create_tournament'),
	path('players/', FetchPlayersView.as_view(), name='fetch_players'),
	path('<int:tournament_id>/players/', AddPlayersToTournamentView.as_view(), name='add_players'),
	path('<int:tournament_id>/progress/', TournamentProgressView.as_view(), name='tournament_progress'),
	path('<int:tournament_id>/announcement/', TournamentAnnouncementView.as_view(), name='tournament_announcement'),
	path('matchmaking/', PerformMatchmakingView.as_view(), name='perform_matchmaking'),
]
