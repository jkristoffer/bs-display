---
description: Update project context in vector database with latest changes
allowed-tools: [bash]
---

# Project Context Updater

Update the vector database with the latest project changes. This re-ingests the entire project to ensure Gemini has access to the most current code, documentation, and configurations.

## When to Use
- After significant code changes
- When adding new components or features
- After updating documentation
- When project structure changes

## Usage
This command will clear the existing vector database and re-ingest all project files with fresh embeddings.

! python3 /Users/kristoffersanio/git/bs-display/dev/rag/gemini_rag_cli.py update --project-root /Users/kristoffersanio/git/bs-display/dev