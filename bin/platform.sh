#!/usr/bin/env bash
set -euo pipefail

# Linux make this executable via: chmod +x platform.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BACKEND_DIR="$ROOT_DIR/../../cads-data-service"
TOOLS_DIR="$ROOT_DIR/../../cads-tools"
UI_DIR="$ROOT_DIR/../../cads-mis"

COMMAND="${1:-help}"
MAC_OVERRIDE="${2:-}"

ensure_network() {
  if ! docker network inspect cads-tools >/dev/null 2>&1; then
    echo "[platform] Creating cads-tools network..."
    docker network create cads-tools
  fi
}

start_tools() {
  echo "[platform] Starting shared infra..."
  "$TOOLS_DIR/harness/run-harness.sh" up
  return $?
}

stop_tools() {
  echo "[platform] Stopping shared infra..."
  "$TOOLS_DIR/harness/run-harness.sh" down
  return $?
}

start_backend() {
  echo "[platform] Starting backend..."
  cd "$BACKEND_DIR"

  OVERRIDE_FILE=$(compose_override)
  echo "[platform] Using override: $OVERRIDE_FILE"

  docker compose -p cads-tools \
    -f docker-compose.yml \
    -f docker-compose.ci-override.yml \
    up -d

  echo "[DEBUG] Backend working directory: $(pwd)"
  ls -1
  echo "[DEBUG] Override file: $OVERRIDE_FILE"

  return $?
}

stop_backend() {
  echo "[platform] Stopping backend..."
  cd "$BACKEND_DIR"
  docker compose -p cads-tools down || true
  return $?
}

start_ui() {
  echo "[platform] Starting UI..."
  cd "$UI_DIR"
  docker compose -p cads-tools up -d
  return $?
}

stop_ui() {
  echo "[platform] Stopping UI..."
  cd "$UI_DIR"
  docker compose -p cads-tools down || true
  return $?
}

case "$COMMAND" in
  up)
    ensure_network
    start_tools
    start_backend
    #start_ui
    ;;
  down)
    #stop_ui
    stop_backend
    stop_tools
    ;;
  *)
    echo "Usage:"
    echo "  ./platform.sh up [override]       # Start UI + backend + tools"
    echo "  ./platform.sh down                # Stop everything"
    echo ""
    echo "Overrides:"
    echo "  --mac-intel   Use docker-compose.override.mac.intel.yml"
    echo "  --mac-arm     Use docker-compose.override.mac.arm.yml"
    echo ""
    echo "Examples:"
    echo "  ./platform.sh up"
    echo "  ./platform.sh up --mac-intel"
    echo "  ./platform.sh up --mac-arm"
    ;;
esac