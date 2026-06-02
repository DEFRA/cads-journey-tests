#!/usr/bin/env bash
set -euo pipefail

# ------------------------------------------------------------
# Resolve ROOT_DIR to the real cads-tools folder
# Works locally AND in GitHub Actions
# ------------------------------------------------------------
if [ -z "${ROOT_DIR:-}" ]; then
  export ROOT_DIR="$(cd "$(dirname "$0")/../../cads-tools" && pwd)"
fi

# ------------------------------------------------------------
# Resolve other repo paths relative to cads-tools
# ------------------------------------------------------------
BACKEND_DIR="$ROOT_DIR/../cads-data-service"
TOOLS_DIR="$ROOT_DIR"
UI_DIR="$ROOT_DIR/../cads-mis"
SEED_SOURCE_DIR="$ROOT_DIR/../cads-data-seed/sql"
SEED_TARGET_DIR="$ROOT_DIR/cads-data-seed/sql"

COMMAND="${1:-help}"
MAC_OVERRIDE="${2:-}"

ensure_network() {
  if ! docker network inspect cads-tools >/dev/null 2>&1; then
    echo "[platform] Creating cads-tools network..."
    docker network create cads-tools
  fi
}

# Determine which override file to use
compose_override() {
  case "$MAC_OVERRIDE" in
    --mac-intel) echo "docker-compose.override.mac.intel.yml" ;;
    --mac-arm)  echo "docker-compose.override.mac.arm.yml" ;;
    *)
      if [ "${CI:-}" = "true" ]; then
        echo "docker-compose.ci-override.yml"
      else
        echo "docker-compose.override.yml"
      fi
      ;;
  esac
  return 0
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

copy_seed_data() {
  if [ -d "$SEED_SOURCE_DIR" ]; then
    echo "[platform] Copying seed data..."
    rm -rf "$SEED_TARGET_DIR"
    mkdir -p "$SEED_TARGET_DIR"
    cp -R "$SEED_SOURCE_DIR"/. "$SEED_TARGET_DIR"/
  else
    echo "[platform] Seed directory not found: $SEED_SOURCE_DIR"
    exit 1
  fi
}

start_backend() {
  echo "[platform] Starting backend..."
  cd "$BACKEND_DIR"

  OVERRIDE_FILE=$(compose_override)
  echo "[platform] Using override: $OVERRIDE_FILE"

  docker compose -p cads-tools \
    -f docker-compose.yml \
    -f "$OVERRIDE_FILE" \
    up --build -d

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

  if [ "${CI:-}" = "true" ]; then
    echo "[platform] Using UI compose file: docker-compose.ci.yml"
    docker compose -p cads-tools -f docker-compose.ci.yml up --build -d
  else
    echo "[platform] Using UI compose file: docker-compose.yml"
    docker compose -p cads-tools -f docker-compose.yml up --build -d
  fi

  return $?
}

stop_ui() {
  echo "[platform] Stopping UI..."
  cd "$UI_DIR"

  if [ "${CI:-}" = "true" ]; then
    docker compose -p cads-tools -f docker-compose.ci.yml down || true
  else
    docker compose -p cads-tools -f docker-compose.yml down || true
  fi

  return $?
}

case "$COMMAND" in
  up)
    copy_seed_data
    ensure_network
    start_tools
    start_backend
    start_ui
    ;;
  down)
    stop_ui
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