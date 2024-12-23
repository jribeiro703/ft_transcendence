from tournament.models import Tournament

def get_user_role(user):
	"""
	Determine the user's role:
	- 'creator': Created an ongoing or upcoming tournament.
	- 'player': Participating in an ongoing tournament.
	- 'invited': Invited to a tournament.
	- 'default': No active role.
	"""
	if Tournament.objects.filter(created_by=user, status__in=["UPCOMING", "ONGOING"]).exists():
		return "creator"
	if user.tournament_players.filter(status__in=["UPCOMING", "ONGOING"]).exists():
		return "player"
	if user.tournament_invites.exists():
		return "invited"
	return "default"