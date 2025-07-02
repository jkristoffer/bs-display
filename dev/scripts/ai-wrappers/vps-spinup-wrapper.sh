#!/bin/bash

# Check for dry-run flag
if [[ "$*" == *"--dry-run"* ]]; then
  echo "🏃 DRY RUN: Would execute VPS spinup"
  echo "VPS instance that would be created:"
  echo "- Size: s-1vcpu-1gb (or as specified)"
  echo "- Region: sgp1 (or as specified)"
  echo "- Image: ubuntu-22-04-x64"
  echo "- SSH key: bs-display-key"
  echo ""
  echo "Would provision with latest code from repository"
  echo "Estimated cost: ~$6/month"
  exit 0
fi

# Check for JSON flag
if [[ "$*" == *"--json"* ]]; then
  # Remove --json from args
  filtered_args=$(echo "$*" | sed 's/--json//g')
  
  # Execute and capture result
  if ./vps-scripts/spin-up.sh $filtered_args; then
    echo '{"command":"vps:spinup","success":true,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
  else
    echo '{"command":"vps:spinup","success":false,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
    exit 1
  fi
  exit 0
fi

# Execute actual command
./vps-scripts/spin-up.sh "$@"