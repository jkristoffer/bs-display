---
description: Query Gemini's project knowledge using local CLI (no API key required)
allowed-tools: [bash]
---

# Project Query (Local CLI)

Query Gemini with full project context using the local Gemini CLI. This version uses keyword-based similarity matching instead of embeddings, so no API key is required.

## Usage Examples
- `gemini-local "How does the ProductCard component work?"`
- `gemini-local "What's the data flow for product filtering?"`
- `gemini-local "Show me the styling patterns used in this project"`

## Setup
```bash
# Install minimal dependencies (no API key needed)
cd rag && pip install -r requirements_local.txt

# Ingest project first
python3 gemini_rag_cli_local.py ingest --project-root /Users/kristoffersanio/git/bs-display/dev
```

! python3 /Users/kristoffersanio/git/bs-display/dev/rag/gemini_rag_cli_local.py query --query "$ARGUMENTS"