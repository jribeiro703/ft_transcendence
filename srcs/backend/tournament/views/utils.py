from tournament.models import Tournament

def get_user_role(user):
	"""
	Determine the user's role:
	- 'creator': Created an ongoing or upcoming tournament
	- 'player': Participating in an ongoing tournament
	- 'invited': Invited to a tournament
	- 'default': No active role
	"""
	print(f"Checking role for user: {user.username}")
	if Tournament.objects.filter(created_by=user, status__in=["UPCOMING", "ONGOING"]).exists():
		print(f"User {user.username} is a creator.")
		return "creator"
	if user.tournament_players.filter(status__in=["UPCOMING", "ONGOING"]).exists():
		print(f"User {user.username} is a player.")
		return "player"
	if user.tournament_invites.exists():
		print(f"User {user.username} is invited.")
		return "invited"
	print(f"User {user.username} has no active role.")
	return "default"
