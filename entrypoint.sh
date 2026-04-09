#!/bin/sh

# Linux make this executable via: chmod +x entrypoint.sh

echo "run_id: $RUN_ID"

# Pick up values from environment variables provided at container runtime.
# EXPECTED ENV VARS:
# - TEST_INPUT: optional test suite filter (e.g. "API" or "UI")
# - ENVIRONMENT: target environment (e.g. "docker", "dev", "test")

TEST_INPUT="${PROFILE}"
ENVIRONMENT="${ENVIRONMENT}"

FILTER=""

if [ -n "$TEST_INPUT" ]; then
  FILTER="$TEST_INPUT"
fi

if [ -z "$FILTER" ]; then
  echo "No filters provided. Running all tests for environment: $ENVIRONMENT"
  CDP=true ENVIRONMENT="$ENVIRONMENT" npx playwright test --config=playwright.config.ts
else
  echo "Running filtered tests with grep: $FILTER"
  CDP=true ENVIRONMENT="$ENVIRONMENT" npx playwright test --config=playwright.config.ts --grep="$FILTER"
fi

npm run report:publish
publish_exit_code=$?

if [ $publish_exit_code -ne 0 ]; then
  echo "failed to publish test results"
  exit $publish_exit_code
fi

# At the end of the test run, if the suite has failed we write a file called 'FAILED'
if [ -f FAILED ]; then
  echo "test suite failed"
  cat ./FAILED
  exit 1
fi

echo "test suite passed"
exit 0
