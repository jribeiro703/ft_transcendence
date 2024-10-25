from django.urls import path
from . import views
from .views import index, get_messages

urlpatterns = [
	# path('', views.index, name='indexOfTed'),
	path('', index, name='home'),
	path('api/messages/', get_messages, name='get_messages'),
]