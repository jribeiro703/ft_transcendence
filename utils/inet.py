#!/usr/bin/python3

import subprocess
import re

def get_local_ip():
	# Run the `ip a` command
	result = subprocess.run(['ip', 'a'], stdout=subprocess.PIPE, text=True)
	
	# Use regex to find the IP address
	ip_pattern = re.compile(r'inet (\d+\.\d+\.\d+\.\d+)/')
	matches = ip_pattern.findall(result.stdout)
	
	# Filter out the loopback address
	local_ips = [ip for ip in matches if not ip.startswith('127.')]
	
	if local_ips:
		return local_ips[0]
	else:
		return None

def update_allowed_hosts(settings_path):
	local_ip = get_local_ip()
	
	if not local_ip:
		print("No local IP address found.")
		return
	
	with open(settings_path, 'r') as file:
		lines = file.readlines()
	
	with open(settings_path, 'w') as file:
		in_allowed_hosts = False
		for line in lines:
			if line.strip().startswith('ALLOWED_HOSTS'):
				in_allowed_hosts = True
				file.write(line)
				continue
			
			if in_allowed_hosts:
				if line.strip().startswith(']'):
					in_allowed_hosts = False
					file.write(line)
					continue
				
				if line.strip().startswith("'"):
					# Replace the first IP in the ALLOWED_HOSTS list
					line = f"    '{local_ip}',\n"
					in_allowed_hosts = False  # Only replace the first IP
			file.write(line)
	print(f"Local IP Address: {local_ip}")

if __name__ == "__main__":
	settings_path = 'srcs/backend/transcendence/settings.py'
	update_allowed_hosts(settings_path)
