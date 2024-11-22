from rest_framework import serializers
from .models import Tournament

class TournamentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tournament
		fields = ['start_date', 'max_score', 'status']
