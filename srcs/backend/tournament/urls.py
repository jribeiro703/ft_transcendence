from django.urls import path

from . import views

from .views.views_tournament import CreateTournamentView, TournamentDetailView


urlpatterns = [
    path("create/", CreateTournamentView.as_view(), name='create-tournament'),
    path("<int:tournament_id>/", TournamentDetailView.as_view(), name="tournament-detail"),
    path("next/<int:tournament_id>/", views.go_to_tournament_next_match, name="tournament-next-match"),
    path("delete/<int:tournament_id>/", views.delete_tournament, name="tournament-delete"),
    path("list/", views.tournament_list, name="tournament-list"),
    path("tokenvalidate", views.validate_game_token, name="validate-game-token"),
]
