---
description: "Fast intelligent git commit with auto-generated conventional commit messages"
---

# Claude Code Fast Commit

Execute our local fast commit script that intelligently analyzes git changes and creates conventional commits in 2-5 seconds.

!./scripts/commit

This command will:
- Analyze unstaged git changes in 2-5 seconds locally  
- Generate intelligent conventional commit messages (type(scope): description)
- Filter out unwanted files (logs, temp files, node_modules)
- Stage only relevant files
- Create commit and push to origin
- Display colorized progress output

Much faster than GitHub Actions (45-90s) with the same intelligence!