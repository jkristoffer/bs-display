---
description: Comprehensive debugging using project-wide context via RAG
allowed-tools: [bash]
---

# Debug Assistant

Perform comprehensive debugging analysis using the entire project context. Gemini will analyze your issue against all relevant code patterns, dependencies, and project structure.

## Usage Examples
- `debug "Images are 404ing on product pages"`
- `debug "TypeScript errors in quiz component"`
- `debug "Build failing with SCSS import issues"`

This command provides:
- Cross-component relationship analysis
- Dependency checking
- Error pattern recognition
- Specific file and line number references
- Debugging steps based on project architecture

! /Users/kristoffersanio/git/bs-display/dev/rag/gemini_rag_clean.sh query --query "DEBUG ANALYSIS for BS Display project: $ARGUMENTS"