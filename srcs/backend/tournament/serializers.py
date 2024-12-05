from rest_framework import serializers
from tournament.models import Tournament

class TournamentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tournament
		fields = ['id', 'name', 'status', 'start_date', 'end_date', 'created_by', 'max_score']
		read_only_fields = ['id', 'created_by']
		extra_kwargs = {
			'name': {'required': True},  # Ensure the name field is required
			'status': {'required': True},  # Ensure the status field is required
			'start_date': {'required': True},  # Ensure the start_date field is required
			'max_score': {'required': True}  # Ensure the max_score field is required
		}
