#!/bin/bash

# Detect platform
PLATFORM=$(uname -m)
if [ "$PLATFORM" = "arm64" ]; then
    export DOCKER_PLATFORM="linux/arm64/v8"
else
    export DOCKER_PLATFORM="linux/amd64"
fi

# Set DOCKER_SOCK variable
if [ ! -S "${XDG_RUNTIME_DIR}/docker.sock" ]; then
    export DOCKER_SOCK="/var/run/docker.sock"
else
    export DOCKER_SOCK="${XDG_RUNTIME_DIR}/docker.sock"
fi

# Set HOSTNAME variable
export HOSTNAME=$(hostname)

# Run make generate-env
make generate-env

# Export variables to .env file
echo "DOCKER_PLATFORM=$DOCKER_PLATFORM" >> ./docker/.env
echo "DOCKER_SOCK=$DOCKER_SOCK" >> ./docker/.env
echo "HOSTNAME=$HOSTNAME" >> ./docker/.env