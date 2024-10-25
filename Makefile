# Variables
DOCKER_COMPOSE	= docker-compose -f docker/docker-compose.yml
PROJECT_NAME	= ft_transcendence

# Default target
.PHONY: all
all: certs generate-env up

# Build the Docker images
.PHONY: build
build:
	touch docker/django/zsh_history
	$(DOCKER_COMPOSE) build

# Start the Docker Compose services
.PHONY: up
up:
	$(DOCKER_COMPOSE) up -d

# Stop the Docker Compose services
.PHONY: down
down:
	$(DOCKER_COMPOSE) down

# Restart the Docker Compose services
.PHONY: restart
restart: down up

# View the logs of the Docker Compose services
.PHONY: logs
logs:
	$(DOCKER_COMPOSE) logs

# View the logs of the Docker Compose services
.PHONY: logs-django
logs-django:
	$(DOCKER_COMPOSE) logs django

# View the logs of the Docker Compose services
.PHONY: logs-db
logs-db:
	$(DOCKER_COMPOSE) logs db

# View the logs of the Docker Compose services
.PHONY: logs-prometheus
logs-prometheus:
	$(DOCKER_COMPOSE) logs prometheus

# View the logs of the Docker Compose services
.PHONY: logs-grafana
logs-grafana:
	$(DOCKER_COMPOSE) logs grafana

# Clean up Docker Compose services and volumes
.PHONY: clean
clean:
	@if [ -n "$$(docker ps -q)" ]; then \
		$(DOCKER_COMPOSE) down -v; \
	else \
		echo "Docker is not running."; \
	fi

# Remove all containers, networks, and images
.PHONY: prune
prune:	clean
	@if [ -n "$$(docker ps -aq)" ]; then docker rm -vf $$(docker ps -aq); fi
	@if [ -n "$$(docker images -aq)" ]; then docker rmi -f $$(docker images -aq); fi
	docker network prune
	docker system prune -a -f

# Show the status of the Docker Compose services
.PHONY: status
status:
	$(DOCKER_COMPOSE) ps

# Execute a shell in the django container
.PHONY: shell-django
shell-django:
	$(DOCKER_COMPOSE) exec django /bin/sh -c "trap 'echo Session ended' EXIT; exec /bin/sh"

# Execute a shell in the db container
.PHONY: shell-db
shell-db:
	$(DOCKER_COMPOSE) exec db /bin/sh -c "trap 'echo Session ended' EXIT; exec /bin/sh"

# Execute a shell in the prometheus container
.PHONY: shell-prometheus
shell-prometheus:
	$(DOCKER_COMPOSE) exec prometheus /bin/sh -c "trap 'echo Session ended' EXIT; exec /bin/sh"

# Execute a shell in the grafana container
.PHONY: shell-grafana
shell-grafana:
	$(DOCKER_COMPOSE) exec grafana /bin/sh -c "trap 'echo Session ended' EXIT; exec /bin/sh"

.PHONY: rootless-docker
rootless-docker:
	@dockerd-rootless-setuptool.sh install || { echo "Failed to install rootless Docker"; exit 1; }
	@export PATH=/usr/bin:${PATH}
	@export DOCKER_HOST=unix://${XDG_RUNTIME_DIR}/docker.sock
	@systemctl --user start docker || { echo "Failed to start rootless Docker"; exit 1; }

.PHONY: update-ip
update-ip:
	python3 ./utils/inet.py

.PHONY: certs
certs:
	openssl req -newkey rsa:2048 -nodes -keyout docker/grafana/certs/grafana.key -x509 -days 365 -out docker/grafana/certs/grafana.crt

.PHONY: generate-env
generate-env:
	@echo "Generating docker/.env file..."
	@touch docker/.env
	@read -p "Do you want to fill it with automatic values? (yes/no): " AUTO_FILL; \
	if [ "$$AUTO_FILL" = "yes" ] || [ "$$AUTO_FILL" = "y" ] || [ "$$AUTO_FILL" = "" ]; then \
		DEBUG="1"; \
		POSTGRES_DB="transcendence"; \
		POSTGRES_USER="transcendence"; \
		POSTGRES_PASSWORD="transcendence"; \
		GF_SECURITY_ADMIN_USER="transcendence"; \
		GF_SECURITY_ADMIN_PASSWORD="transcendence"; \
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
	fi; \
	DJANGO_SECRET_KEY=$$(python3 utils/generate_secret_key.py); \
	echo "DEBUG=$$DEBUG" > docker/.env; \
	echo "DJANGO_SETTINGS_MODULE=transcendence.settings" >> docker/.env; \
	echo "POSTGRES_DB=$$POSTGRES_DB" >> docker/.env; \
	echo "POSTGRES_USER=$$POSTGRES_USER" >> docker/.env; \
	echo "POSTGRES_PASSWORD=$$POSTGRES_PASSWORD" >> docker/.env; \
	echo "DB_HOST=db" >> docker/.env; \
	echo "DB_PORT=5432" >> docker/.env; \
	echo "GF_SECURITY_ADMIN_USER=$$GF_SECURITY_ADMIN_USER" >> docker/.env; \
	echo "GF_SECURITY_ADMIN_PASSWORD=$$GF_SECURITY_ADMIN_PASSWORD" >> docker/.env; \
	echo "GF_SERVER_PROTOCOL=https" >> docker/.env; \
	echo "GF_SERVER_CERT_FILE=/etc/grafana/certs/grafana.crt" >> docker/.env; \
	echo "GF_SERVER_CERT_KEY=/etc/grafana/certs/grafana.key" >> docker/.env; \
	echo 'DATA_SOURCE_NAME=postgresql://$${POSTGRES_USER}:$${POSTGRES_PASSWORD}@$${DB_HOST}:$${DB_PORT}/$${POSTGRES_DB}?sslmode=disable' >> docker/.env; \
	python utils/generate_secret_key.py; \
	echo "Updated docker/.env file successfully."