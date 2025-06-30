---
description: Ingest project using local system (no API key required)
allowed-tools: [bash]
---

# Project Context Ingester (Local)

This command ingests the entire BS Display project into a local SQLite database using keyword-based indexing. No API key required - uses the local Gemini CLI for responses.

## Usage
This command will:
1. Scan all relevant project files (.tsx, .ts, .js, .astro, .md, .json, .scss, etc.)
2. Split content into semantic chunks  
3. Extract keywords and store in SQLite database
4. Enable fast keyword-based context retrieval

## Setup
```bash
cd rag && pip install -r requirements_local.txt
```

! python3 /Users/kristoffersanio/git/bs-display/dev/rag/gemini_rag_cli_local.py ingest --project-root /Users/kristoffersanio/git/bs-display/dev