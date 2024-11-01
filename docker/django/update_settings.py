import os
import secrets

def generate_secret_key():
	return ''.join(secrets.choice('abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)') for i in range(50))

new_secret_key = generate_secret_key()

# Update the .env file
env_file_path = '/.env'
updated_lines = []
secret_key_found = False

with open(env_file_path, 'r') as file:
	for line in file:
		if line.startswith('DJANGO_SECRET_KEY='):
			updated_lines.append(f"DJANGO_SECRET_KEY='{new_secret_key}'\n")
			secret_key_found = True
		else:
			updated_lines.append(line)

if not secret_key_found:
	updated_lines.append(f"DJANGO_SECRET_KEY='{new_secret_key}'\n")

with open(env_file_path, 'w') as file:
	file.writelines(updated_lines)

print(f"Updated .env with new SECRET_KEY: '{new_secret_key}'")

# Update the settings.py file
settings_file_path = '/settings.py'
allowed_hosts_updated_lines = []

hostname = os.getenv('HOSTNAME', 'localhost')

with open(settings_file_path, 'r') as file:
	in_allowed_hosts = False
	for line in file:
		if line.startswith('ALLOWED_HOSTS ='):
			allowed_hosts_updated_lines.append("ALLOWED_HOSTS = [\n")
			in_allowed_hosts = True
		elif in_allowed_hosts:
			if ']' in line:
				allowed_hosts_updated_lines.append(f"\t'127.0.0.1',\n\t'0.0.0.0',\n\t'localhost',\n\t'{hostname}'\n]\n")
				in_allowed_hosts = False
		else:
			allowed_hosts_updated_lines.append(line)

with open(settings_file_path, 'w') as file:
	file.writelines(allowed_hosts_updated_lines)

print(f"Updated settings.py with hosts: '127.0.0.1', '0.0.0.0', 'localhost', '{hostname}'")