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
CDS_DIR="$ROOT_DIR/../cads-data-service"
CADS_BRIDGE_DIR="$ROOT_DIR/../cads-bridge"
TOOLS_DIR="$ROOT_DIR"
UI_DIR="$ROOT_DIR/../cads-mis"

COMMAND="${1:-help}"
MAC_OVERRIDE="${2:-}"

ensure_network() {
  if ! docker network inspect cads-network >/dev/null 2>&1; then
    echo "[platform] Creating cads-network..."
    docker network create cads-network
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

start_cds() {
  echo "[platform] Starting cds..."
  cd "$CDS_DIR"

  OVERRIDE_FILE=$(compose_override)
  echo "[platform] Using override: $OVERRIDE_FILE"

  docker compose -p cads \
    -f docker-compose.yml \
    -f "$OVERRIDE_FILE" \
    up --build -d

  return $?
}

stop_cds() {
  echo "[platform] Stopping cds..."
  cd "$CDS_DIR"
  docker compose -p cads down || true
  return $?
}

start_ui() {
  echo "[platform] Starting UI..."
  cd "$UI_DIR"

  if [ "${CI:-}" = "true" ]; then
    echo "[platform] Using UI compose file: docker-compose.ci.yml"
    docker compose -p cads -f docker-compose.ci.yml up --build -d
  else
    echo "[platform] Using UI compose file: docker-compose.yml"
    docker compose -p cads -f docker-compose.yml up --build -d
  fi

  return $?
}

stop_ui() {
  echo "[platform] Stopping UI..."
  cd "$UI_DIR"

  if [ "${CI:-}" = "true" ]; then
    docker compose -p cads -f docker-compose.ci.yml down || true
  else
    docker compose -p cads -f docker-compose.yml down || true
  fi

  return $?
}

start_bridge() {
  echo "[platform] starting bridge..."

  cd "$CADS_BRIDGE_DIR"
  OVERRIDE_FILE=$(compose_override)
  echo "[platform] Using bridge override: $OVERRIDE_FILE"

  docker compose -p cads \
    -f docker-compose.yml \
    -f "$OVERRIDE_FILE" \
    up --build -d

  return $?
}

stop_bridge() {
  echo "[platform] Stopping bridge..."
  cd "$CADS_BRIDGE_DIR"
  docker compose -p cads -f docker-compose.yml down || true
  return $?
}

case "$COMMAND" in
  up)
    ensure_network
    start_tools
    start_cds
    start_ui
    start_bridge
    ;;
  down)
    stop_ui
    stop_cds
    stop_tools
    stop_bridge
    ;;
  *)
    echo "Usage:"
    echo "  ./platform.sh up [override]       # Start UI + cds + tools"
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