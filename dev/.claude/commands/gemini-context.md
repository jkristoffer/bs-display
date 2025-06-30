---
description: Ingest entire project into a vector database for Gemini's project-wide analysis
allowed-tools: [bash]
---

# Project Context Ingester

This command ingests the entire BS Display project into a vector database, enabling Gemini to provide project-aware responses for debugging, code review, and architectural decisions.

## Usage
This command will:
1. Scan all relevant project files (.tsx, .ts, .js, .astro, .md, .json, .scss, etc.)
2. Split content into semantic chunks  
3. Generate embeddings using Gemini's text-embedding-004 model
4. Store in ChromaDB for fast retrieval

! /Users/kristoffersanio/git/bs-display/dev/rag/gemini_rag_wrapper.sh ingest --project-root /Users/kristoffersanio/git/bs-display/dev