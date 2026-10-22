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
JOURNEY_TESTS_DIR="$ROOT_DIR/../cads-journey-tests"

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

wait_for_bridge() {
  echo "[platform] Waiting for cads-bridge to be ready..."
  for _ in $(seq 1 45); do
    if docker inspect -f '{{.State.Running}}' cads-bridge 2>/dev/null | grep -q true; then
      docker network connect cads-network cads-bridge 2>/dev/null || true
      if docker exec cads-cds getent hosts cads-bridge >/dev/null 2>&1; then
        echo "[platform] cads-bridge is running and DNS-resolvable on cads-network"
        docker exec cads-cds getent hosts cads-bridge || true
        return 0
      fi
      echo "[platform] cads-bridge is running; waiting for DNS on cads-network..."
    else
      echo "[platform] cads-bridge not running yet..."
      docker ps -a --filter name=cads-bridge --format 'table {{.Names}}\t{{.Status}}' || true
    fi
    sleep 2
  done

  echo "[platform] ERROR: cads-bridge is not running/resolvable on cads-network"
  docker ps -a --filter name=cads-bridge || true
  docker compose -p cads-bridge ps || true
  docker inspect cads-bridge --format '{{json .State}} {{json .NetworkSettings.Networks}}' 2>/dev/null || true
  docker logs cads-bridge 2>/dev/null | tail -200 || true
  return 1
}

start_bridge() {
  echo "[platform] starting bridge..."
  echo "[platform] CADS_BRIDGE_DIR=$CADS_BRIDGE_DIR"

  if [ ! -d "$CADS_BRIDGE_DIR" ]; then
    echo "[platform] ERROR: cads-bridge directory not found at $CADS_BRIDGE_DIR"
    return 1
  fi

  cd "$CADS_BRIDGE_DIR"
  OVERRIDE_FILE=$(compose_override)
  echo "[platform] Using bridge override: $OVERRIDE_FILE"
  echo "[platform] CI=${CI:-<unset>}"

  if [ ! -f "$OVERRIDE_FILE" ]; then
    echo "[platform] ERROR: bridge override file not found: $OVERRIDE_FILE"
    return 1
  fi

  COMPOSE_FILES=(-f docker-compose.yml -f "$OVERRIDE_FILE")
  if [ "${CI:-}" = "true" ] && [ -f "$JOURNEY_TESTS_DIR/compose/bridge.ci-fix.yml" ]; then
    echo "[platform] Applying journey-tests bridge CI fixes"
    COMPOSE_FILES+=(-f "$JOURNEY_TESTS_DIR/compose/bridge.ci-fix.yml")
  fi

  # Dedicated compose project so CDS/UI/journey-tests cannot tear bridge down.
  docker compose -p cads-bridge "${COMPOSE_FILES[@]}" up --build -d

  echo "[platform] Bridge compose ps:"
  docker compose -p cads-bridge ps || true
  docker ps -a --filter name=cads-bridge || true

  wait_for_bridge
  return $?
}

stop_bridge() {
  echo "[platform] Stopping bridge..."
  cd "$CADS_BRIDGE_DIR"
  docker compose -p cads-bridge -f docker-compose.yml down || true
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