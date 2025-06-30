---
description: Query Gemini's project knowledge for specific analysis via RAG
allowed-tools: [bash]
---

# Project Query

Query Gemini with full project context using RAG (Retrieval-Augmented Generation). Gemini will retrieve relevant code snippets, documentation, and configuration details to provide comprehensive, project-aware responses.

## Usage Examples
- `gemini "How does the ProductCard component work?"`
- `gemini "What's the data flow for product filtering?"`
- `gemini "Show me the styling patterns used in this project"`

! /Users/kristoffersanio/git/bs-display/dev/rag/gemini_rag_clean.sh query --query "$ARGUMENTS"