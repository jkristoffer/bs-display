#!/bin/bash

# Check for dry-run flag
if [[ "$*" == *"--dry-run"* ]]; then
  echo "🏃 DRY RUN: Would execute VPS cleanup"
  echo "Resources that would be cleaned up:"
  echo "- Checking for active droplets..."
  
  # Show what would be cleaned up without actually doing it
  if command -v doctl >/dev/null 2>&1; then
    echo "Active droplets:"
    doctl compute droplet list --format ID,Name,Status || echo "  No droplets found or API error"
    echo ""
    echo "Would clean up any BS-Display related resources"
  else
    echo "  doctl not found - would install if needed"
  fi
  exit 0
fi

# Check for JSON flag
if [[ "$*" == *"--json"* ]]; then
  # Remove --json from args
  filtered_args=$(echo "$*" | sed 's/--json//g')
  
  # Execute and capture result
  if ./vps-scripts/cleanup.sh $filtered_args; then
    echo '{"command":"vps:cleanup","success":true,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
  else
    echo '{"command":"vps:cleanup","success":false,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
    exit 1
  fi
  exit 0
fi

# Execute actual command
./vps-scripts/cleanup.sh "$@"