# Variables
DOCKER_COMPOSE	= docker-compose -f docker/docker-compose.yml
PROJECT_NAME	= ft_transcendence

# Default target
.PHONY: all
all: update-ip up

# Build the Docker images
.PHONY: build
build:
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
