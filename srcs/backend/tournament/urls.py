from django.urls import path
from .views.stage_1_generate_tournament_name import (
	GenerateTournamentNameView,
	ValidateTournamentNameView,
)

from .views.stage_1_create_tournament import (
	CreateTournamentView,
	PreRegisterPlayersView,
)

from .views.stage_1_fetch_eligible_players import (
	FetchEligiblePlayersView,
)
from .views.stage_1_fetch_participants import (
	FetchParticipantsView,
)
from .views.tournament_progress import TournamentProgressView
from .views.tournament_announcement import TournamentAnnouncementView
from .views.stage_2_matchmaking import PerformMatchmakingView 


urlpatterns = [
	path('generate-name/', GenerateTournamentNameView.as_view(), name='generate_name'),
	path('validate-name/', ValidateTournamentNameView.as_view(), name='validate_name'),
	path('', CreateTournamentView.as_view(), name='create_tournament'),
	path('players/', FetchEligiblePlayersView.as_view(), name='fetch_eligible_players'),
	path('preregister/', PreRegisterPlayersView.as_view(), name='preregister_players'),
	path('matchmaking/', PerformMatchmakingView.as_view(), name='perform_matchmaking'),
]

