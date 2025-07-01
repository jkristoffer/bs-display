---
description: "Fast intelligent git commit with auto-generated conventional commit messages"
---

# Claude Code Fast Commit

Lean, fast, one-click intelligent git commit with conventional commit messages.

!bash -c '
set -euo pipefail

# Quick change check
if git diff --quiet && git diff --cached --quiet; then
  echo "⚠️  No changes to commit"
  exit 0
fi

# Get and filter changed files
CHANGED_FILES=$(git diff --name-only 2>/dev/null || echo "")
if [ -z "$CHANGED_FILES" ]; then
  echo "⚠️  No unstaged changes"
  exit 0
fi

FILTERED_FILES=$(echo "$CHANGED_FILES" | grep -v -E "\\.(log|tmp|cache)$|node_modules/|\\.DS_Store|temp|\\.git/" | grep -v "^\\.\\./" | sed "s|^dev/||" || echo "")
if [ -z "$FILTERED_FILES" ]; then
  echo "⚠️  No relevant files (filtered out temp files)"
  exit 0
fi

# Detect commit type and scope
COMMIT_TYPE="feat"
SCOPE=""

case "$CHANGED_FILES" in
  *\\.md*|*README*|*docs/*) COMMIT_TYPE="docs" ;;
  *package*.json*) COMMIT_TYPE="chore" ;;
  *test*|*spec*) COMMIT_TYPE="test" ;;
  *\\.css*|*\\.scss*|*style*) COMMIT_TYPE="style" ;;
  *\\.github/workflows/*) COMMIT_TYPE="ci" ;;
esac

case "$CHANGED_FILES" in
  *src/components/*) SCOPE="components" ;;
  *src/pages/*) SCOPE="pages" ;;
  *scripts/*) SCOPE="scripts" ;;
  *\\.github/workflows/*) SCOPE="ci" ;;
esac

# Generate commit message
FILE_COUNT=$(echo "$FILTERED_FILES" | wc -l)
if [ $FILE_COUNT -eq 1 ]; then
  MAIN_FILE=$(echo "$FILTERED_FILES" | head -1)
  DESCRIPTION="update $(basename "$MAIN_FILE")"
else
  DESCRIPTION="update $FILE_COUNT files"
fi

if [ -n "$SCOPE" ]; then
  COMMIT_MSG="$COMMIT_TYPE($SCOPE): $DESCRIPTION"
else
  COMMIT_MSG="$COMMIT_TYPE: $DESCRIPTION"
fi

echo "📝 $COMMIT_MSG"
echo "$FILTERED_FILES" | sed "s/^/  /"

# Stage, commit, and push
echo "$FILTERED_FILES" | while IFS= read -r file; do
  [ -f "$file" ] && git add "$file"
done

git commit -m "$COMMIT_MSG

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
echo "✅ Committed and pushed!"
'

**Features:**
- ⚡ **One-click** - No prompts, no interruptions
- 🧠 **Smart commits** - Conventional format (type(scope): description)  
- 🗂️ **Auto-filtering** - Skips logs, temp files, node_modules
- 🎯 **Auto-scoping** - Detects components, pages, scripts, ci
- 🔄 **Complete flow** - analyze → stage → commit → push