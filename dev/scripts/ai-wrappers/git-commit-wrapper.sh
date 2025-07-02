#!/bin/bash

# Check for dry-run flag
if [[ "$*" == *"--dry-run"* ]]; then
  echo "🏃 DRY RUN: Would execute git commit"
  echo "Files that would be committed:"
  git status --short
  echo ""
  echo "Commit message would be generated based on changes"
  echo "Would push to origin/main after commit"
  exit 0
fi

# Check for JSON flag
if [[ "$*" == *"--json"* ]]; then
  # Remove --json from args
  filtered_args=$(echo "$*" | sed 's/--json//g')
  
  # Execute and capture result
  if ./scripts/commit $filtered_args; then
    echo '{"command":"git:commit","success":true,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
  else
    echo '{"command":"git:commit","success":false,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
    exit 1
  fi
  exit 0
fi

# Execute actual command
./scripts/commit "$@"