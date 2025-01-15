from django.urls import path

from . import views

urlpatterns = [
	path("form/", views.get_tournament_form_page, name="tournament-form-page"),
    path("<uuid:tournament_id>/", views.get_tournament_page, name="tournament-page"),
    path("next/<uuid:tournament_id>/", views.go_to_tournament_next_match, name="tournament-next-match"),
    path("winner/<uuid:tournament_id>/", views.get_winner_page, name="tournament-winner-page"),
    path("game/<uuid:match_id>/", views.get_game_page, name="tournament-game-page"),
    path("create/", views.create_tournament, name="tournament-create"),
    path("delete/<uuid:tournament_id>/", views.delete_tournament, name="tournament-delete"),
    path("info/", views.get_tournament_info, name="tournament-info"),
    path("list/", views.tournament_list, name="tournament-list"),
    path("tokenvalidate", views.validate_game_token, name="validate-game-token"),
]
