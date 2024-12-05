from django.contrib import admin
from .models import Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('nickname', 'content', 'timestamp')
    search_fields = ('nickname', 'content')
    list_filter = ('timestamp',)