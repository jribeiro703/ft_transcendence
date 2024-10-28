from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
	list_display = ('username', 'email',)
	search_fields = ('username', 'email',)
	ordering = ('username',)
	list_filter = ('email',)

admin.site.register(User, UserAdmin)