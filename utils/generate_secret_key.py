import secrets

def generate_secret_key():
    return ''.join(secrets.choice('abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)') for i in range(50))

new_secret_key = generate_secret_key()

# Update the .env file
env_file_path = 'docker/.env'
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