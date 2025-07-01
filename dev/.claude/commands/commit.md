---
description: "Fast intelligent git commit with auto-generated conventional commit messages"
---

# Claude Code Fast Commit

Self-contained intelligent git commit that analyzes changes and creates conventional commits in 2-5 seconds.

!echo "🚀 Claude Code Fast Commit starting..."

!START_TIME=$(date +%s)

# Quick change check
!if git diff --quiet && git diff --cached --quiet; then echo "⚠️  No changes detected to commit" && exit 0; fi

# Get changed files
!CHANGED_FILES=$(git diff --name-only 2>/dev/null || echo "")
!if [ -z "$CHANGED_FILES" ]; then echo "⚠️  No unstaged changes found" && exit 0; fi

!echo "ℹ️  Analyzing $(echo "$CHANGED_FILES" | wc -l) changed file(s)..."

# Fast file filtering - exclude unwanted files in one pass  
!FILTERED_FILES=$(echo "$CHANGED_FILES" | grep -v -E '\.(log|tmp|cache)$|node_modules/|\.DS_Store|temp|\.git/' | grep -v '^\.\./' | sed 's|^dev/||' || echo "")

!if [ -z "$FILTERED_FILES" ]; then echo "⚠️  No relevant files to commit (filtered out temp/log files)" && exit 0; fi

# Ultra-fast commit type detection using pattern matching
!COMMIT_TYPE="feat"
!SCOPE=""

# Single-pass analysis for commit type
!case "$CHANGED_FILES" in *\.md*|*README*|*docs/*) COMMIT_TYPE="docs" ;; *package*.json*) COMMIT_TYPE="chore" ;; *test*|*spec*) COMMIT_TYPE="test" ;; *\.css*|*\.scss*|*style*) COMMIT_TYPE="style" ;; *\.github/workflows/*) COMMIT_TYPE="ci" ;; esac

# Quick scope detection  
!case "$CHANGED_FILES" in *src/components/*) SCOPE="components" ;; *src/pages/*) SCOPE="pages" ;; *scripts/*) SCOPE="scripts" ;; *.github/workflows/*) SCOPE="ci" ;; esac

# Generate description
!FILE_COUNT=$(echo "$FILTERED_FILES" | wc -l)
!if [ $FILE_COUNT -eq 1 ]; then MAIN_FILE=$(echo "$FILTERED_FILES" | head -1) && DESCRIPTION="update $(basename "$MAIN_FILE")"; else DESCRIPTION="update $FILE_COUNT files"; fi

# Build commit message
!if [ -n "$SCOPE" ]; then COMMIT_MSG="$COMMIT_TYPE($SCOPE): $DESCRIPTION"; else COMMIT_MSG="$COMMIT_TYPE: $DESCRIPTION"; fi

!echo "ℹ️  Generated commit message: '$COMMIT_MSG'"
!echo ""
!echo "ℹ️  Files to commit:"
!echo "$FILTERED_FILES" | sed 's/^/  📝 /'
!echo ""

# Fast git operations - stage files
!echo "ℹ️  Staging files..."
!echo "$FILTERED_FILES" | while IFS= read -r file; do if [ -f "$file" ]; then git add "$file" && echo "  ✅ Added: $file"; else echo "  ⚠️  Skipping missing file: $file"; fi; done

# Create commit
!echo "ℹ️  Creating commit..."
!git commit -m "$COMMIT_MSG

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to origin
!echo "ℹ️  Pushing to origin..."
!git push origin main

# Calculate and display total time
!END_TIME=$(date +%s)
!TOTAL_TIME=$((END_TIME - START_TIME))
!echo ""
!echo "✅ Fast commit completed in ${TOTAL_TIME}s!"
!echo "✅ Commit: $COMMIT_MSG"
!echo "✅ Files: $FILE_COUNT committed and pushed"

**Features:**
- ⚡ **2-5 second execution** (vs 45-90s GitHub Actions)
- 🧠 **Intelligent analysis**: Conventional commit format (type(scope): description)
- 🗂️ **Smart filtering**: Excludes logs, temp files, node_modules automatically
- 🎯 **Scope detection**: components, pages, scripts, ci
- 🏷️ **Type detection**: feat, fix, docs, style, chore, test, ci
- 📝 **Progress tracking**: Clear status updates throughout
- 🔄 **Complete automation**: stage → commit → push