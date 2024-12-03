from django.contrib import admin
from .models import User
from game.models import Game
from game.models import GamePlayer
from tournament.models import Tournament

class UserAdmin(admin.ModelAdmin):
	list_display = ('username', 'email',)
	search_fields = ('username', 'alias', 'email',)
	ordering = ('username',)
	list_filter = ('email',)

class GameAdmin(admin.ModelAdmin):
	ordering = ('created_at',)

class GamePlayerAdmin(admin.ModelAdmin):
	ordering = ('game_id',)
 
class TournamentAdmin(admin.ModelAdmin):
	ordering = ('created_at',)

admin.site.register(User, UserAdmin)
admin.site.register(Game, GameAdmin)
admin.site.register(GamePlayer, GamePlayerAdmin)
admin.site.register(Tournament, TournamentAdmin)
