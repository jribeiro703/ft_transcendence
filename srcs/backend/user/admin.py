from django.contrib import admin
from .models import User
from game.models import Game
from game.models import GamePlayer
from tournament.models import Tournament

class UserAdmin(admin.ModelAdmin):
	list_display = ('id', 'username', 'email', 'is_online',)
	search_fields = ('username', 'alias', 'email', 'is_online')
	ordering = ('id',)
	list_filter = ('email',)

class GameAdmin(admin.ModelAdmin):
	ordering = ('created_at',)

class GamePlayerAdmin(admin.ModelAdmin):
	ordering = ('game_id',)
 
class TournamentAdmin(admin.ModelAdmin):
	list_display = ('id', 'created_by',)
	ordering = ('created_at',)

admin.site.register(User, UserAdmin)
admin.site.register(Game, GameAdmin)
admin.site.register(GamePlayer, GamePlayerAdmin)
admin.site.register(Tournament, TournamentAdmin)
