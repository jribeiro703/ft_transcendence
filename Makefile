# Variables:
COMPOSE_CHECK := $(shell command -v docker-compose 2> /dev/null)
DOCKER_COMPOSE_NEW := $(shell docker compose version 2> /dev/null)

ifdef DOCKER_COMPOSE_NEW
	COMPOSE = compose
else ifdef COMPOSE_CHECK
	COMPOSE = docker-compose
else
	$(error "docker-compose is not installed. Please install docker-compose to continue.")
endif

DOCKER_COMPOSE	= DOCKER_PLATFORM=$(DOCKER_PLATFORM) DOCKER_SOCK=$(DOCKER_SOCK) HOSTNAME=$(HOSTNAME) docker $(COMPOSE) -f docker/docker-compose.yml
PROJECT_NAME	= ft_transcendence
DOCKER_SOCK = $(shell if [ ! -S "$${XDG_RUNTIME_DIR}/docker.sock" ]; then echo "/var/run/docker.sock"; else echo "$${XDG_RUNTIME_DIR}/docker.sock"; fi)
HOSTNAME = $(shell hostname)

# Detect plaform
PLATFORM		= $(shell uname -m)
ifeq ($(PLATFORM),arm64)
	DOCKER_PLATFORM = linux/arm64/v8
else
	DOCKER_PLATFORM = linux/amd64
endif

# Export environment variables
export DOCKER_PLATFORM
export DOCKER_SOCK
export HOSTNAME

# Default target
all: generate-env up

# Build the Docker images
build:
	$(DOCKER_COMPOSE) build 

# Start the Docker Compose services
up:
	$(DOCKER_COMPOSE) up -d

# Stop the Docker Compose services
down:
	$(DOCKER_COMPOSE) down

# Restart the Docker Compose services
restart: down up

# Show the status of the Docker Compose services
status:
	$(DOCKER_COMPOSE) ps

# View the logs of the Docker Compose services
logs:
	$(DOCKER_COMPOSE) logs

logs-%:  ## View logs for a specific service (e.g., `make logs-django`)
	$(DOCKER_COMPOSE) logs $*

# Shell Access
shell-%:  ## Access shell of a specific service (e.g., `make shell-django`)
	$(DOCKER_COMPOSE) exec $* /bin/sh -c "trap 'echo Session ended' EXIT; exec /bin/sh"
# zsh
zsh-%:  ## Access shell of a specific service (e.g., `make shell-django`)
	$(DOCKER_COMPOSE) exec $* /bin/zsh -c "trap 'echo Session ended' EXIT; exec /bin/zsh"

# Shell Access
zsh-%:  ## Access shell of a specific service (e.g., `make shell-django`)
	$(DOCKER_COMPOSE) exec $* /bin/sh -c "trap 'echo Session ended' EXIT; exec /bin/zsh"

# Remove containers and volumes if running
clean:  
	@$(DOCKER_COMPOSE) down -v || echo "No running Docker services to clean."

# Prune Docker system, images, and containers
prune: clean  
	docker system prune -af --volumes

# Remove a specific container and its associated image (e.g., `make prune-container C=<container_name>`)
prune-container:
	@if [ -z "$(C)" ]; then \
		echo "Usage: make prune-container C=<container_name>"; \
		exit 1; \
	fi; \
	container_name="$(C)"; \
	container_id=$$(docker ps -aq -f name=$$container_name); \
	if [ -n "$$container_id" ]; then \
		image_id=$$(docker inspect --format='{{.Image}}' $$container_id); \
		echo "Removing container '$$container_name'..."; \
		docker rm -vf $$container_id; \
		if [ -n "$$image_id" ]; then \
			echo "Removing associated image '$$image_id'..."; \
			docker rmi -f $$image_id || echo "Image '$$image_id' is in use by another container."; \
		fi; \
	else \
		echo "Container '$$container_name' not found."; \
	fi

# Restart a specific container
restart-container:
	@if [ -z "$(C)" ]; then \
		echo "Usage: make restart-container C=<container_name>"; \
		exit 1; \
	fi; \
	container_name="$(C)"; \
	echo "Restarting container '$$container_name'..."; \
	$(DOCKER_COMPOSE) restart $$container_name


# Remove a specific image (e.g., `make prune-image I=<image_name_or_id>`)
prune-image:
	@if [ -z "$(I)" ]; then \
		echo "Usage: make prune-image I=<image_name_or_id>"; \
		exit 1; \
	fi; \
	image_name="$(I)"; \
	if docker images -q $$image_name > /dev/null; then \
		echo "Removing image '$$image_name'..."; \
		docker rmi -f $$image_name || echo "Failed to remove image '$$image_name'. It may be in use by a container."; \
	else \
		echo "Image '$$image_name' not found."; \
	fi

rootless-docker:
	@dockerd-rootless-setuptool.sh install || { echo "Failed to install rootless Docker"; exit 1; }
	@export PATH=/usr/bin:${PATH}
	@export DOCKER_HOST=unix://${XDG_RUNTIME_DIR}/docker.sock
	@systemctl --user start docker || { echo "Failed to start rootless Docker"; exit 1; }

open:
	@xdg-open https://$$(hostname):8081
	@xdg-open https://$$(hostname):8081/admin

generate-env:
	@echo "Generating docker/.env file..."
	@touch docker/django/zsh_history
	@mkdir -p docker/nginx/certs
	@mkdir -p docker/nginx/htpasswd
	@touch docker/.env
	@touch docker/django/zsh_history
	@read -p "Do you want to fill it with automatic values? (yes/no): " AUTO_FILL; \
	docker run --rm --platform $(DOCKER_PLATFORM) -v $$(pwd)/docker/nginx/certs:/certs alpine/openssl req -newkey rsa:2048 -nodes -keyout /certs/localhost.key -x509 -days 365 -out /certs/localhost.crt -subj "/C=FR/ST=France/L=Paris/O=transcendence/OU=transcendence/CN=localhost/emailAddress=transcendence@transcendence.com"; \
	docker run --rm --platform $(DOCKER_PLATFORM) -v $$(pwd)/docker/nginx/certs:/certs alpine/openssl req -newkey rsa:2048 -nodes -keyout /certs/$$(hostname).key -x509 -days 365 -out /certs/$$(hostname).crt -subj "/C=FR/ST=France/L=Paris/O=transcendence/OU=transcendence/CN=$$(hostname)/emailAddress=transcendence@transcendence.com"; \
	docker run --rm --platform $(DOCKER_PLATFORM) -v $$(pwd)/docker/nginx/certs:/certs alpine/openssl req -newkey rsa:2048 -nodes -keyout /certs/elasticsearch.key -x509 -days 365 -out /certs/elasticsearch.crt -subj "/C=FR/ST=France/L=Paris/O=elasticsearch/OU=elasticsearch/CN=elasticsearch/emailAddress=elasticsearch@elasticsearch.com"; \
	if [ "$$AUTO_FILL" = "yes" ] || [ "$$AUTO_FILL" = "y" ] || [ "$$AUTO_FILL" = "" ]; then \
		DEBUG="1"; \
		POSTGRES_DB="transcendence"; \
		POSTGRES_USER="transcendence"; \
		POSTGRES_PASSWORD="transcendence"; \
		GF_SECURITY_ADMIN_USER="transcendence"; \
		GF_SECURITY_ADMIN_PASSWORD="transcendence"; \
		HTPASSWD_USER="transcendence"; \
		HTPASSWD_PASSWORD="transcendence"; \
	else \
		while [ -z "$$DEBUG" ]; do \
			read -p "Enter DEBUG (0 or 1): " DEBUG; \
			if [ "$$DEBUG" != "0" ] && [ "$$DEBUG" != "1" ]; then \
				echo "Invalid DEBUG value"; DEBUG=""; \
			fi; \
		done; \
		while [ -z "$$POSTGRES_DB" ]; do \
			read -p "Enter POSTGRES_DB: " POSTGRES_DB; \
			if [ -z "$$POSTGRES_DB" ]; then \
				echo "POSTGRES_DB cannot be empty"; \
			fi; \
		done; \
		while [ -z "$$POSTGRES_USER" ]; do \
			read -p "Enter POSTGRES_USER: " POSTGRES_USER; \
			if [ -z "$$POSTGRES_USER" ]; then \
				echo "POSTGRES_USER cannot be empty"; \
			fi; \
		done; \
		while [ -z "$$POSTGRES_PASSWORD" ]; do \
			read -p "Enter POSTGRES_PASSWORD: " POSTGRES_PASSWORD; \
			if [ -z "$$POSTGRES_PASSWORD" ]; then \
				echo "POSTGRES_PASSWORD cannot be empty"; \
			fi; \
		done; \
		while [ -z "$$GF_SECURITY_ADMIN_USER" ]; do \
			read -p "Enter GF_SECURITY_ADMIN_USER: " GF_SECURITY_ADMIN_USER; \
			if [ -z "$$GF_SECURITY_ADMIN_USER" ]; then \
				echo "GF_SECURITY_ADMIN_USER cannot be empty"; \
			fi; \
		done; \
		while [ -z "$$GF_SECURITY_ADMIN_PASSWORD" ]; do \
			read -p "Enter GF_SECURITY_ADMIN_PASSWORD: " GF_SECURITY_ADMIN_PASSWORD; \
			if [ -z "$$GF_SECURITY_ADMIN_PASSWORD" ]; then \
				echo "GF_SECURITY_ADMIN_PASSWORD cannot be empty"; \
			fi; \
		done; \
		while [ -z "$$HTPASSWD_USER" ]; do \
			read -p "Enter HTPASSWD_USER (nginx): " HTPASSWD_USER; \
			if [ -z "$$HTPASSWD_USER" ]; then \
				echo "HTPASSWD_USER cannot be empty"; \
			fi; \
		done; \
		while [ -z "$$HTPASSWD_PASSWORD" ]; do \
			read -p "Enter HTPASSWD_PASSWORD (nginx, elastic): " HTPASSWD_PASSWORD; \
			if [ -z "$$HTPASSWD_PASSWORD" ]; then \
				echo "HTPASSWD_PASSWORD cannot be empty"; \
			fi; \
		done; \
	fi; \
	echo "DEBUG=$$DEBUG" > docker/.env; \
	docker run --rm --platform $(DOCKER_PLATFORM) -e HOSTNAME=$$(hostname) -v $$(pwd)/docker/.env:/.env -v $$(pwd)/srcs/backend/transcendence/settings.py:/settings.py -v $$(pwd)/docker/django/update_settings.py:/update_settings.py python:3.10-slim python /update_settings.py; \
	docker run --rm --platform $(DOCKER_PLATFORM) backplane/htpasswd -b -B -n $${HTPASSWD_USER} $${HTPASSWD_PASSWORD} > docker/nginx/htpasswd/prometheus.localhost; \
	docker run --rm --platform $(DOCKER_PLATFORM) backplane/htpasswd -b -B -n $${HTPASSWD_USER} $${HTPASSWD_PASSWORD} > docker/nginx/htpasswd/postgres-exporter.localhost; \
	docker run --rm --platform $(DOCKER_PLATFORM) backplane/htpasswd -b -B -n $${HTPASSWD_USER} $${HTPASSWD_PASSWORD} > docker/nginx/htpasswd/node-exporter.localhost; \
	echo "DJANGO_SETTINGS_MODULE=transcendence.settings" >> docker/.env; \
	echo "POSTGRES_DB=$$POSTGRES_DB" >> docker/.env; \
	echo "POSTGRES_USER=$$POSTGRES_USER" >> docker/.env; \
	echo "POSTGRES_PASSWORD=$$POSTGRES_PASSWORD" >> docker/.env; \
	echo "DB_HOST=db" >> docker/.env; \
	echo "DB_PORT=5432" >> docker/.env; \
	echo "GF_SECURITY_ADMIN_USER=$$GF_SECURITY_ADMIN_USER" >> docker/.env; \
	echo "GF_SECURITY_ADMIN_PASSWORD=$$GF_SECURITY_ADMIN_PASSWORD" >> docker/.env; \
	echo "GF_SERVER_PROTOCOL=http" >> docker/.env; \
	echo 'DATA_SOURCE_NAME=postgresql://$${POSTGRES_USER}:$${POSTGRES_PASSWORD}@$${DB_HOST}:$${DB_PORT}/$${POSTGRES_DB}?sslmode=disable' >> docker/.env; \
	echo "ELASTIC_USER=elastic" >> docker/.env; \
	echo "ELASTIC_PASSWORD=$$HTPASSWD_PASSWORD" >> docker/.env; \
	echo "HOSTNAME=$$HOSTNAME" >> docker/.env; \
	echo "Updated docker/.env file successfully."

.PHONY: all build up down restart status logs logs-% shell-% rootless-docker generate-env prune-container prune-image restart-container
