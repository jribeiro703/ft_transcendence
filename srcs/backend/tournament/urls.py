from django.urls import path

from . import views

urlpatterns = [
    path("next/<uuid:tournament_id>/", views.go_to_tournament_next_match, name="tournament-next-match"),
    path("create/", views.create_tournament, name="tournament-create"),
    path("delete/<uuid:tournament_id>/", views.delete_tournament, name="tournament-delete"),
    path("info/", views.get_tournament_info, name="tournament-info"),
    path("list/", views.tournament_list, name="tournament-list"),
    path("tokenvalidate", views.validate_game_token, name="validate-game-token"),
]
