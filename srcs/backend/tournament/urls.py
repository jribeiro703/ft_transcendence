from django.urls import path

from .views.stage_1_generate_tournament_name import (
	GenerateTournamentNameView,
	ValidateTournamentNameView,
)

from .views.stage_1_create_tournament import (
	CreateTournamentView,
	PreRegisterPlayersView,
	GetTournamentView,
	JoinTournamentView,
	ListUserTournamentsView,
)

from .views.stage_1_fetch_eligible_players import (
	FetchPlayersView,
)
from .views.stage_1_fetch_participants import (
	FetchParticipantsView,
)
from .views.stage_2_matchmaking import (
	TournamentBracketView,
	CurrentPlayersView
)

from .views.tournament_progress import TournamentProgressView
from .views.tournament_announcement import TournamentAnnouncementView
from .views.stage_2_matchmaking import PerformMatchmakingView 


urlpatterns = [
	path('', CreateTournamentView.as_view(), name='create_tournament'),
	path('players/', FetchPlayersView.as_view(), name='fetch_players'),
	path('preregister/', PreRegisterPlayersView.as_view(), name='preregister_players'),
	path('generate-name/', GenerateTournamentNameView.as_view(), name='generate-name'),
	path('validate-name/', ValidateTournamentNameView.as_view(), name='validate-name'),
	path('join/', JoinTournamentView.as_view(), name='join-tournament'),
	path('matchmaking/', PerformMatchmakingView.as_view(), name='perform_matchmaking'),
	path('<int:tournament_id>/players/', CurrentPlayersView.as_view(), name='current-players'),
	path('<int:tournament_id>/bracket/', TournamentBracketView.as_view(), name='tournament-bracket'),
	path('<int:tournament_id>/', GetTournamentView.as_view(), name='get-tournament'),
	path('user-tournaments/', ListUserTournamentsView.as_view(), name='user-tournaments'),
]
