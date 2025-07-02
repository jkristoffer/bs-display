#!/bin/bash

# Check for dry-run flag
if [[ "$*" == *"--dry-run"* ]]; then
  echo "🏃 DRY RUN: Would execute blog generation"
  echo "Blog post that would be created:"
  echo "- Location: src/content/blog/"
  echo "- Format: Markdown with frontmatter"
  echo "- SEO optimized content"
  echo "- Automated title and meta description"
  echo ""
  echo "Would analyze content queue for next topic"
  echo "Would generate 1000-2000 word article"
  exit 0
fi

# Check for JSON flag
if [[ "$*" == *"--json"* ]]; then
  # Remove --json from args
  filtered_args=$(echo "$*" | sed 's/--json//g')
  
  # Execute and capture result
  if node scripts/generate-blog-post.js $filtered_args; then
    echo '{"command":"content:blog:generate","success":true,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
  else
    echo '{"command":"content:blog:generate","success":false,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
    exit 1
  fi
  exit 0
fi

# Execute actual command
node scripts/generate-blog-post.js "$@"