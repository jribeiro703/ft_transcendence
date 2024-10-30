from django.contrib import admin
from .models import User
from game.models import Game
from tournament.models import Tournament

class UserAdmin(admin.ModelAdmin):
	list_display = ('username', 'email',)
	search_fields = ('username', 'alias', 'email',)
	ordering = ('username',)
	list_filter = ('email',)

class GameAdmin(admin.ModelAdmin):
	ordering = ('created_at',)

class TournamentAdmin(admin.ModelAdmin):
	ordering = ('created_at',)

admin.site.register(User, UserAdmin)
admin.site.register(Game, GameAdmin)
admin.site.register(Tournament, TournamentAdmin)
