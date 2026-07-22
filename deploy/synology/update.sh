#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$SCRIPT_DIR"

if docker compose version >/dev/null 2>&1; then
  docker compose -f compose.yaml pull app
  docker compose -f compose.yaml up -d --no-deps app
else
  docker-compose -f compose.yaml pull app
  docker-compose -f compose.yaml up -d --no-deps app
fi
