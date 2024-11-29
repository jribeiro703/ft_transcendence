from rest_framework import serializers
from tournament.models import Tournament

class TournamentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tournament
		fields = ['id', 'status', 'start_date', 'end_date', 'created_by', 'max_score']
		read_only_fields = ['id', 'created_by']
