#!/bin/bash

# Image name
IMAGE_NAME="local-rag-mcp"

# Check if image exists
if [[ "$(docker images -q $IMAGE_NAME 2> /dev/null)" == "" ]]; then
  echo "Building Docker image $IMAGE_NAME..." >&2
  docker build -t $IMAGE_NAME "$(dirname "$0")" >&2
fi

# Run the container
# -i: Keep stdin open (required for MCP)
# --rm: Remove container after exit
# -v $HOME:$HOME: Map home directory so the container can access files to index at the same paths
# -e USER_DATA_DIR: Pass configured data dir or default
# -u $(id -u):$(id -g): Run as current user to avoid permission issues with created files (optional, but good practice)
# Note: Running as user might cause issues if the container user doesn't exist. 
# For simplicity in this local tool, we'll run as root inside but map files. 
# Actually, running as root inside might own files as root on host (linux). On Mac Docker Desktop handles this mapping gracefully usually.
# Let's stick to simple execution first.

docker run --rm -i \
  -v "$HOME:$HOME" \
  -e PYTHONPATH=/app \
  $IMAGE_NAME
