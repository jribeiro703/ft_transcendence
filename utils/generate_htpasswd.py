import bcrypt
import getpass
import sys

def generate_htpasswd(username, password):
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    with open('docker/nginx/conf.d/.htpasswd', 'w') as f:
        f.write(f"{username}:{hashed.decode('utf-8')}\n")
    print("Password file generated successfully.")

if len(sys.argv) > 1 and sys.argv[1] == "AUTO":
    username = "transcendence"
    password = "transcendence"
else:
    username = input("Enter nginx username: ")
    while not username:
        print("Username cannot be empty.")
        username = input("Enter nginx username: ")

    password = getpass.getpass("Enter nginx password: ")
    while not password:
        print("Password cannot be empty.")
        password = getpass.getpass("Enter nginx password: ")

generate_htpasswd(username, password)