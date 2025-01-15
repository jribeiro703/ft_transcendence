from django.contrib import admin
from django import forms
from .models import User, FriendRequest
from game.models import Game
from game.models import GamePlayer
from tournament.models import Tournament

class UserAdminForm(forms.ModelForm):
	class Meta:
		model = User
		fields = '__all__'

	friends = forms.ModelMultipleChoiceField(
		queryset=User.objects.all(),
		required=False,
		widget=admin.widgets.FilteredSelectMultiple('Friends', is_stacked=False)
	)

	blocklist = forms.ModelMultipleChoiceField(
		queryset=User.objects.all(),
		required=False,
		widget=admin.widgets.FilteredSelectMultiple('Blocked Users', is_stacked=False)
	)

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		if self.instance.pk:
			self.fields['friends'].initial = self.instance.friends.all()
			self.fields['blocklist'].initial = self.instance.blocklist.all()

	def save(self, commit=True):
		user = super().save(commit=False)
		if commit:
			user.save()
		if user.pk:
			user.friends.set(self.cleaned_data['friends'])
			user.blocklist.set(self.cleaned_data['blocklist'])
			self.save_m2m()
		return user

class UserAdmin(admin.ModelAdmin):
	form = UserAdminForm
	list_display = ('username', 'email', 'is_online')
	search_fields = ('username', 'email')

class GameAdmin(admin.ModelAdmin):
	ordering = ('created_at',)

class GamePlayerAdmin(admin.ModelAdmin):
	ordering = ('game_id',)
 
class TournamentAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'created_by',)
	ordering = ('created_at',)

class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'created_at', 'is_accepted')
    list_filter = ('is_accepted', 'created_at')
    search_fields = ('sender__username', 'receiver__username')
    ordering = ('-created_at',)

admin.site.register(User, UserAdmin)
admin.site.register(Game, GameAdmin)
admin.site.register(GamePlayer, GamePlayerAdmin)
admin.site.register(Tournament, TournamentAdmin)
admin.site.register(FriendRequest, FriendRequestAdmin)
