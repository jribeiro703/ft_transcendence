from django.urls import path

from . import views

urlpatterns = [
	path("tournament/form/", views.get_tournament_form_page, name="tournament-form-page"),
    path("tournament/<uuid:tournament_id>/", views.get_tournament_page, name="tournament-page"),
    path("tournament/next/<uuid:tournament_id>/", views.go_to_tournament_next_match, name="tournament-next-match"),
    path("tournament/winner/<uuid:tournament_id>/", views.get_winner_page, name="tournament-winner-page"),
    path("tournament/game/<uuid:match_id>/", views.get_game_page, name="tournament-game-page"),
    path("tournament/create/", views.create_tournament, name="tournament-create"),
    path("tournament/delete/<uuid:tournament_id>/", views.delete_tournament, name="tournament-delete"),
    path("tournament/info/", views.get_tournament_info, name="tournament-info"),
    path("tournament/list/", views.tournament_list, name="tournament-list"),
    
]
