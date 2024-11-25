from django.urls import path
from .views.tournament_creation import (
	CreateTournamentView,
	PlayerListView,
	AddPlayersToTournamentView,
	TournamentProgressView,
)

urlpatterns = [
	path('', CreateTournamentView.as_view(), name='create_tournament'),
	#path('players/', PlayerListView.as_view(), name='fetch_player_list'),
	path('<int:tournament_id>/players/', AddPlayersToTournamentView.as_view(), name='add_players'),
	path('<int:tournament_id>/progress/', TournamentProgressView.as_view(), name='tournament_progress'),
]


# urlpatterns = [
# 	path('tournaments/create/', CreateTournamentView.as_view(), name='create-tournament'),
# 	path('tournaments/<int:tournament_id>/add-players/', AddPlayersToTournamentView.as_view(), name='add-players-to-tournament'),
# 	path('tournaments/<int:tournament_id>/progress/', TournamentProgressView.as_view(), name='tournament-progress'),
# 	path('players/', PlayerListView.as_view(), name='player-list'),
# ]
