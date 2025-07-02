#!/bin/bash

# Check for dry-run flag
if [[ "$*" == *"--dry-run"* ]]; then
  echo "🏃 DRY RUN: Would execute RAG cleanup"
  echo "Data that would be cleaned:"
  
  if [ -d "rag/chroma_db" ]; then
    echo "- ChromaDB database ($(du -sh rag/chroma_db 2>/dev/null | cut -f1 || echo 'unknown size'))"
    echo "- Vector embeddings"
    echo "- Knowledge base index"
  else
    echo "- No ChromaDB database found"
  fi
  
  echo ""
  echo "Would require re-ingestion to rebuild knowledge base"
  exit 0
fi

# Check for JSON flag
if [[ "$*" == *"--json"* ]]; then
  # Remove --json from args
  filtered_args=$(echo "$*" | sed 's/--json//g')
  
  # Execute and capture result
  if ./rag/gemini_rag_clean.sh $filtered_args; then
    echo '{"command":"rag:clean","success":true,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
  else
    echo '{"command":"rag:clean","success":false,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
    exit 1
  fi
  exit 0
fi

# Execute actual command
./rag/gemini_rag_clean.sh "$@"