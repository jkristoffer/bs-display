#!/bin/bash

VERBOSE=false
COMMAND=""
ARGS=()

# Parse arguments
for arg in "$@"; do
  if [[ "$arg" == "--verbose" ]]; then
    VERBOSE=true
  else
    if [[ -z "$COMMAND" ]]; then
      COMMAND="$arg"
    else
      ARGS+=("$arg")
    fi
  fi
done

if [[ "$VERBOSE" == true ]]; then
  echo "[VERBOSE] Starting execution at $(date)"
  echo "[VERBOSE] Command: $COMMAND"
  echo "[VERBOSE] Arguments: ${ARGS[@]}"
  echo "[VERBOSE] Working directory: $(pwd)"
  echo "[VERBOSE] Environment: NODE_ENV=${NODE_ENV:-undefined}"
  echo "[VERBOSE] User: $(whoami)"
  echo "[VERBOSE] Shell: $SHELL"
  echo "[VERBOSE] ---"
fi

# Validate command exists
if [[ -z "$COMMAND" ]]; then
  echo "[ERROR] No command specified"
  exit 1
fi

# Execute with verbose output
if [[ "$VERBOSE" == true ]]; then
  START_TIME=$(date +%s%N)
  
  # Add timestamp to each line of output
  if [[ "${#ARGS[@]}" -eq 0 ]]; then
    $COMMAND 2>&1 | while IFS= read -r line; do
      echo "[$(date +%H:%M:%S)] $line"
    done
  else
    $COMMAND "${ARGS[@]}" 2>&1 | while IFS= read -r line; do
      echo "[$(date +%H:%M:%S)] $line"
    done
  fi
  
  # Capture exit code from the pipeline
  EXIT_CODE=${PIPESTATUS[0]}
  
  END_TIME=$(date +%s%N)
  DURATION=$(( (END_TIME - START_TIME) / 1000000 )) # Convert to milliseconds
  
  echo "[VERBOSE] Exit code: $EXIT_CODE"
  echo "[VERBOSE] Duration: ${DURATION}ms"
  echo "[VERBOSE] Completed at $(date)"
  
  exit $EXIT_CODE
else
  # Execute normally without verbose output
  if [[ "${#ARGS[@]}" -eq 0 ]]; then
    $COMMAND
  else
    $COMMAND "${ARGS[@]}"
  fi
fi