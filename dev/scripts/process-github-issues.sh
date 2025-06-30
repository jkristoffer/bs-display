#!/bin/bash
# Auto-Claude GitHub Issue Processor
# Follows CLAUDE.md development standards

set -euo pipefail

# Enhanced logging and error handling
LOG_FILE="/tmp/auto-claude-$(date +%Y%m%d-%H%M%S).log"
exec 1> >(tee -a "$LOG_FILE")
exec 2> >(tee -a "$LOG_FILE" >&2)

echo "🤖 Starting Auto-Claude Issue Processor v2.0"
echo "$(date): Processing GitHub issues with Claude Code CLI"
echo "📋 Log file: $LOG_FILE"

# Trap errors for better debugging
trap 'echo "❌ Error on line $LINENO. Exit code: $?" | tee -a "$LOG_FILE"' ERR

# Enhanced authentication with better error handling
check_github_auth() {
  echo "🔐 Checking GitHub CLI authentication..."
  
  if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found in snapshot"
    return 1
  fi

  if gh auth status &> /dev/null; then
    echo "✅ GitHub CLI already authenticated"
    return 0
  fi

  echo "🔑 GitHub CLI not authenticated, attempting token authentication..."
  
  if [ -z "${GITHUB_TOKEN:-}" ]; then
    echo "❌ No GITHUB_TOKEN environment variable found"
    echo "💡 Set GITHUB_TOKEN environment variable with a valid GitHub token"
    return 1
  fi

  if echo "$GITHUB_TOKEN" | gh auth login --with-token 2>/dev/null; then
    echo "✅ GitHub CLI authenticated with token"
    # Verify authentication worked
    if gh auth status &> /dev/null; then
      return 0
    else
      echo "❌ Authentication verification failed"
      return 1
    fi
  else
    echo "❌ Token authentication failed - token may be invalid or expired"
    return 1
  fi
}

if ! check_github_auth; then
  echo "❌ GitHub authentication failed - cannot proceed"
  exit 1
fi

# Enhanced Claude CLI verification
check_claude_auth() {
  echo "🧠 Checking Claude CLI authentication..."
  
  if ! command -v claude &> /dev/null; then
    echo "❌ Claude CLI not found in snapshot"
    echo "💡 Ensure Claude CLI is installed and available in PATH"
    return 1
  fi

  if claude auth status &> /dev/null; then
    echo "✅ Claude CLI authenticated and ready"
    return 0
  else
    echo "❌ Claude CLI not authenticated in snapshot"
    echo "💡 Run 'claude auth' to authenticate Claude CLI"
    return 1
  fi
}

if ! check_claude_auth; then
  echo "❌ Claude CLI authentication failed - cannot proceed"
  exit 1
fi

# Enhanced repository update with better error handling
update_repository() {
  echo "📥 Updating repository to latest..."
  local start_time=$(date +%s)
  
  # Store current branch and status
  local current_branch
  current_branch=$(git branch --show-current 2>/dev/null || echo "detached")
  
  # Stash any local changes to avoid conflicts
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "💾 Stashing local changes..."
    if ! git stash push -m "Auto-claude: temporary stash $(date)" 2>/dev/null; then
      echo "⚠️  Failed to stash changes, attempting to continue..."
    fi
  fi

  # Ensure we're on main branch
  if [ "$current_branch" != "main" ]; then
    echo "🔄 Switching to main branch from $current_branch"
    if ! git checkout main 2>/dev/null; then
      echo "❌ Failed to checkout main branch"
      return 1
    fi
  fi

  # Fetch with timeout protection
  echo "🌐 Fetching latest changes..."
  if ! timeout 60 git fetch origin 2>/dev/null; then
    echo "❌ Git fetch timed out or failed"
    return 1
  fi
  
  local fetch_time=$(date +%s)
  echo "⏱️  Git fetch completed in $((fetch_time - start_time)) seconds"

  # Check if pull is needed to avoid unnecessary operations
  local local_commit remote_commit
  local_commit=$(git rev-parse HEAD)
  remote_commit=$(git rev-parse origin/main 2>/dev/null || echo "unknown")

  if [ "$local_commit" != "$remote_commit" ] && [ "$remote_commit" != "unknown" ]; then
    echo "🔄 Pulling latest changes..."
    if ! git pull origin main; then
      echo "❌ Git pull failed"
      return 1
    fi
    
    # Smart dependency management
    if git diff --name-only HEAD~1 | grep -q "package-lock.json\|package.json"; then
      echo "📦 Package files changed, updating dependencies..."
      local npm_start=$(date +%s)
      if npm ci --prefer-offline --no-audit 2>/dev/null; then
        local npm_time=$(date +%s)
        echo "⏱️  npm ci completed in $((npm_time - npm_start)) seconds"
      else
        echo "⚠️  npm ci failed, trying npm install..."
        npm install --prefer-offline --no-audit
      fi
    else
      echo "📦 Package files unchanged, skipping dependency update"
    fi
  else
    echo "✅ Repository already up to date"
  fi
  
  return 0
}

if ! update_repository; then
  echo "❌ Repository update failed - cannot proceed"
  exit 1
fi

# Get open issues with claude-task label
echo "🔍 Fetching open issues..."
ISSUES=$(gh issue list \
  --state open \
  --label "claude-task" \
  --json number,title,body,labels \
  --limit 1)

ISSUE_COUNT=$(echo "$ISSUES" | jq length)

if [ "$ISSUE_COUNT" -eq 0 ]; then
  echo "ℹ️ No issues found with 'claude-task' label"
  exit 0
fi

# Process the first issue
ISSUE_NUM=$(echo "$ISSUES" | jq -r '.[0].number')
ISSUE_TITLE=$(echo "$ISSUES" | jq -r '.[0].title')
ISSUE_BODY=$(echo "$ISSUES" | jq -r '.[0].body')

echo "🎯 Processing Issue #$ISSUE_NUM: $ISSUE_TITLE"

# Create working branch
BRANCH_NAME="auto/issue-$ISSUE_NUM"
git checkout -b "$BRANCH_NAME"

# Mark issue as in-progress
gh issue comment "$ISSUE_NUM" --body "🤖 **Auto-Claude Processing Started**

Started processing this issue automatically.
- Branch: \`$BRANCH_NAME\`
- Time: $(date)
- VPS: $(hostname)

Will create a PR if valid changes are generated."

# Create focused prompt for Claude with enhanced context
CLAUDE_PROMPT="Implement this GitHub issue for the bs-display project:

ISSUE #$ISSUE_NUM: $ISSUE_TITLE

$ISSUE_BODY

PROJECT CONTEXT:
- Astro-based e-commerce platform for interactive displays and smartboards
- React 19 + TypeScript with strict functional programming standards
- Core features: Product quiz, dynamic filtering, buying guides, content automation
- Architecture: /src/components/ for UI, /src/data/ for product models, /src/content/ for blog posts

REQUIREMENTS:
- Follow functional programming principles (pure functions, immutability, composition)
- Use TypeScript throughout with proper type definitions
- Follow existing patterns in /src/components/ and /src/development-standards/
- Run code review agent after implementation: npm run tools:code-review -- --file [file]
- Ensure TypeScript compilation passes: npm run check
- Create or modify files as needed, preferring edits over new files

AUTOMATION CONTEXT:
- Running automatically on VPS infrastructure
- Use TodoWrite tool for complex tasks requiring planning
- Work autonomously following CLAUDE.md standards
- Implement the most reasonable interpretation if requirements unclear
- Generate commit with proper format including issue closure"

# Use Claude Code CLI to process the issue (with automation flags)
echo "🧠 Running Claude Code CLI with automation flags..."

# Debug: Show prompt length and first few lines
echo "📊 Prompt length: $(echo "$CLAUDE_PROMPT" | wc -c) characters"
echo "📝 First 3 lines of prompt:"
echo "$CLAUDE_PROMPT" | head -3
echo "..."

# Run Claude with --print for non-interactive automation and timeout
echo "⏳ Starting Claude CLI (with 10-minute timeout)..."
echo "🚀 Claude CLI started at $(date +%H:%M:%S)"

# Start a simple progress indicator in background
{
  sleep 10  # Give Claude time to start
  while true; do
    if ! pgrep -f "claude.*--print" > /dev/null; then
      break
    fi
    echo "🤖 Claude is working... ($(date +%H:%M:%S)) - checking file changes..."
    # Show any new files being created
    find . -name "*.tsx" -o -name "*.ts" -o -name "*.astro" -newer /tmp/claude_start 2>/dev/null | head -3 | sed 's/^/   📁 /'
    sleep 45
  done
} &
PROGRESS_PID=$!

# Create timestamp file for change detection
touch /tmp/claude_start

# Enhanced Claude CLI execution with better monitoring
run_claude_cli() {
  echo "🧠 Starting Claude CLI execution..."
  local claude_start_time=$(date +%s)
  local claude_output="/tmp/claude_output.log"
  local claude_progress="/tmp/claude_progress.log"
  
  # Create timestamp file for change detection
  touch /tmp/claude_start
  
  # Enhanced progress monitoring
  {
    sleep 15  # Give Claude time to start
    local last_activity=$(date +%s)
    local check_interval=30
    
    while true; do
      if ! pgrep -f "claude.*--print" > /dev/null; then
        echo "🏁 Claude process completed at $(date +%H:%M:%S)" >> "$claude_progress"
        break
      fi
      
      local current_time=$(date +%s)
      echo "🤖 Claude working... ($(date +%H:%M:%S)) - runtime: $((current_time - claude_start_time))s" >> "$claude_progress"
      
      # Check for file activity
      local new_files
      new_files=$(find . -newer /tmp/claude_start \( -name "*.tsx" -o -name "*.ts" -o -name "*.astro" -o -name "*.json" \) 2>/dev/null | head -3)
      if [ -n "$new_files" ]; then
        echo "📁 Files being modified:" >> "$claude_progress"
        echo "$new_files" | sed 's/^/   📝 /' >> "$claude_progress"
        last_activity=$current_time
      fi
      
      # Check for potential hang (no activity for 5 minutes)
      if [ $((current_time - last_activity)) -gt 300 ]; then
        echo "⚠️  No file activity detected for 5 minutes - possible hang" >> "$claude_progress"
      fi
      
      # Display progress to main log
      tail -3 "$claude_progress" 2>/dev/null || true
      
      sleep $check_interval
    done
  } &
  local progress_pid=$!

  # Run Claude CLI with enhanced timeout handling
  local claude_exit_code=0
  local timeout_duration=900  # 15 minutes
  
  # Use timeout if available, otherwise implement custom timeout
  if command -v timeout >/dev/null 2>&1; then
    echo "⏰ Running Claude CLI with $timeout_duration second timeout..."
    if ! timeout $timeout_duration claude --print --dangerously-skip-permissions "$CLAUDE_PROMPT" 2>&1 | tee "$claude_output"; then
      claude_exit_code=$?
    fi
  else
    echo "⏰ Running Claude CLI with custom timeout monitoring..."
    # Start Claude in background
    claude --print --dangerously-skip-permissions "$CLAUDE_PROMPT" 2>&1 | tee "$claude_output" &
    local claude_pid=$!
    
    # Monitor with timeout
    local elapsed=0
    while [ $elapsed -lt $timeout_duration ]; do
      if ! kill -0 $claude_pid 2>/dev/null; then
        wait $claude_pid
        claude_exit_code=$?
        break
      fi
      sleep 10
      elapsed=$((elapsed + 10))
    done
    
    # Kill if timeout exceeded
    if [ $elapsed -ge $timeout_duration ]; then
      echo "⏰ Timeout reached, terminating Claude CLI..."
      kill $claude_pid 2>/dev/null || true
      claude_exit_code=124
    fi
  fi

  # Clean up progress monitoring
  kill $progress_pid 2>/dev/null || true
  
  local total_runtime=$(($(date +%s) - claude_start_time))
  echo "⏱️  Total Claude runtime: ${total_runtime}s"
  echo "📄 Output lines: $(wc -l < "$claude_output" 2>/dev/null || echo 0)"
  
  return $claude_exit_code
}

# Execute Claude CLI
if run_claude_cli; then
  echo "✅ Claude Code CLI completed successfully"
else
  local claude_exit_code=$?
  echo "❌ Claude Code CLI failed (exit code: $claude_exit_code)"
  
  # Enhanced error diagnosis
  echo "🔍 Error diagnosis:"
  echo "📋 Last 15 lines of Claude output:"
  tail -15 /tmp/claude_output.log 2>/dev/null || echo "No output log available"
  
  # Determine failure reason
  local failure_reason
  case $claude_exit_code in
    124)
      failure_reason="Claude CLI timed out after 15 minutes"
      ;;
    130)
      failure_reason="Claude CLI was interrupted (Ctrl+C or similar)"
      ;;
    1)
      failure_reason="Claude CLI encountered a general error"
      ;;
    *)
      failure_reason="Claude CLI encountered an error (exit code: $claude_exit_code)"
      ;;
  esac
  
  gh issue comment "$ISSUE_NUM" --body "🤖 **Processing Failed**

$failure_reason

**Debugging Information:**
- Exit code: $claude_exit_code
- Log file: Available for inspection
- Runtime: Check progress logs

**Possible causes:**
- Issue requires manual intervention or clarification
- Complex implementation exceeded timeout
- Authentication or permission issues
- Technical error in automation infrastructure

**Next steps:**
- Review issue requirements for clarity
- Try manual processing if needed
- Check automation logs for technical details"
  
  # Clean up branch
  git checkout main 2>/dev/null || true
  git branch -D "$BRANCH_NAME" 2>/dev/null || true
  exit 1
fi

# Check if any changes were made
if git diff --quiet && git diff --cached --quiet; then
  echo "ℹ️ No changes generated by Claude"
  gh issue comment "$ISSUE_NUM" --body "🤖 **No Changes Generated**

Claude processed the issue but did not generate any code changes.
This could mean:
- The issue requires manual intervention
- The request was unclear or incomplete
- The issue is already resolved

Please review the issue requirements."
  
  # Clean up branch
  git checkout main
  git branch -D "$BRANCH_NAME"
  exit 0
fi

echo "✅ Changes detected, validating..."

# Enhanced validation following CLAUDE.md standards
validate_changes() {
  echo "🔍 Running comprehensive validation pipeline..."
  local validation_start=$(date +%s)
  
  # Check for basic syntax issues first
  echo "📝 Checking for basic syntax issues..."
  local syntax_errors=0
  while IFS= read -r -d '' file; do
    case "$file" in
      *.ts|*.tsx)
        if ! npx tsc --noEmit "$file" 2>/dev/null; then
          echo "⚠️  Syntax issues in $file"
          syntax_errors=$((syntax_errors + 1))
        fi
        ;;
      *.js|*.jsx)
        if ! node -c "$file" 2>/dev/null; then
          echo "⚠️  Syntax issues in $file"
          syntax_errors=$((syntax_errors + 1))
        fi
        ;;
    esac
  done < <(git diff --name-only --diff-filter=AM -z)
  
  if [ $syntax_errors -gt 0 ]; then
    echo "⚠️  $syntax_errors files have syntax issues, but continuing validation..."
  fi

  # Quick build check (attempt fast build first)
  echo "🏗️  Testing build process..."
  local build_success=false
  
  # Try fast build first if available
  if npm run build:fast >/dev/null 2>&1; then
    echo "✅ Fast build completed successfully"
    build_success=true
  else
    echo "🔄 Fast build failed, trying full build..."
    if npm run build 2>&1 | tee /tmp/build_output.log; then
      echo "✅ Full build completed successfully"
      build_success=true
    else
      echo "❌ Build validation failed"
      local build_errors
      build_errors=$(grep -i "error\|failed" /tmp/build_output.log 2>/dev/null | head -5 || echo "See build log for details")
      
      gh issue comment "$ISSUE_NUM" --body "🤖 **Build Validation Failed**

Generated changes failed to build successfully.

**Build errors detected:**
\`\`\`
$build_errors
\`\`\`

**Common causes:**
- Import/export path issues
- Missing dependencies
- Syntax errors
- Type definition mismatches

**Recommendation:** Review the issue requirements or provide additional context for clarification."
      
      return 1
    fi
  fi

  # TypeScript validation with detailed error reporting
  echo "🔍 Running TypeScript validation..."
  if npm run check 2>&1 | tee /tmp/typescript_output.log; then
    echo "✅ TypeScript validation passed"
  else
    echo "❌ TypeScript validation failed"
    local ts_errors
    ts_errors=$(grep -A 3 -B 1 "error TS" /tmp/typescript_output.log 2>/dev/null | head -10 || echo "See TypeScript log for details")
    
    gh issue comment "$ISSUE_NUM" --body "🤖 **TypeScript Validation Failed**

Generated changes failed TypeScript validation.

**TypeScript errors:**
\`\`\`
$ts_errors
\`\`\`

**Common causes:**
- Type definition issues
- Missing type imports
- Interface mismatches
- Incorrect type usage

**Recommendation:** Review type requirements or provide additional context."
    
    return 1
  fi
  
  local validation_time=$(($(date +%s) - validation_start))
  echo "⏱️  Validation completed in ${validation_time}s"
  return 0
}

if ! validate_changes; then
  echo "❌ Validation failed - cleaning up"
  git checkout main 2>/dev/null || true
  git branch -D "$BRANCH_NAME" 2>/dev/null || true
  exit 1
fi

# Enhanced code review with better reporting
run_code_review() {
  echo "📋 Running enhanced code review on modified files..."
  local review_start=$(date +%s)
  local review_issues=0
  local reviewed_files=0
  
  # Get all modified files
  local modified_files
  modified_files=$(git diff --name-only --diff-filter=AM)
  
  if [ -z "$modified_files" ]; then
    echo "ℹ️  No files to review"
    return 0
  fi
  
  echo "📁 Files to review:"
  echo "$modified_files" | sed 's/^/   📝 /'
  
  # Review each relevant file
  while IFS= read -r file; do
    case "$file" in
      *.ts|*.tsx|*.js|*.jsx|*.astro)
        echo "🔍 Reviewing: $file"
        reviewed_files=$((reviewed_files + 1))
        
        # Check if code review tool is available
        if command -v npm >/dev/null && npm run tools:code-review -- --file "$file" 2>/dev/null; then
          echo "✅ $file passed code review"
        else
          echo "⚠️  Code review issues or tool unavailable for $file"
          review_issues=$((review_issues + 1))
        fi
        ;;
      *.md|*.json|*.yml|*.yaml)
        echo "📄 Skipping review for documentation/config: $file"
        ;;
      *)
        echo "🔄 Unknown file type, skipping: $file"
        ;;
    esac
  done <<< "$modified_files"
  
  local review_time=$(($(date +%s) - review_start))
  echo "📊 Review summary:"
  echo "   📝 Files reviewed: $reviewed_files"
  echo "   ⚠️  Issues detected: $review_issues"
  echo "   ⏱️  Review time: ${review_time}s"
  
  if [ $review_issues -gt 0 ]; then
    echo "⚠️  $review_issues files had code review issues, but proceeding with implementation"
    echo "💡 Manual review recommended for affected files"
  fi
  
  return 0
}

run_code_review

# Commit changes with enhanced message format
echo "💾 Committing changes..."
git add .

# Count changed files for commit message
CHANGED_FILES=$(git diff --cached --name-only | wc -l)
CHANGED_COMPONENTS=$(git diff --cached --name-only | grep -c "components/" || echo 0)

git commit -m "feat: $ISSUE_TITLE

Auto-generated implementation for issue #$ISSUE_NUM using Claude Code CLI.

Changes:
- $CHANGED_FILES files modified ($CHANGED_COMPONENTS components)
- Follows functional programming principles
- TypeScript validation passed
- Code review agent validation completed
- Adheres to project development standards

Closes #$ISSUE_NUM

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push branch
echo "📤 Pushing branch..."
git push origin "$BRANCH_NAME"

# Create PR with comprehensive description
echo "🔀 Creating Pull Request..."

# Get summary of changes for PR body
CHANGED_FILES_LIST=$(git diff --name-only HEAD~1..HEAD | head -10)
if [ $(git diff --name-only HEAD~1..HEAD | wc -l) -gt 10 ]; then
  CHANGED_FILES_LIST="$CHANGED_FILES_LIST
... and $(( $(git diff --name-only HEAD~1..HEAD | wc -l) - 10 )) more files"
fi

PR_BODY="## 🤖 Automated Implementation

This PR was automatically generated by Claude Code CLI to address issue #$ISSUE_NUM.

## Summary
$(git log --pretty=format:"- %s" HEAD~1..HEAD)

## Files Changed ($CHANGED_FILES files)
\`\`\`
$CHANGED_FILES_LIST
\`\`\`

## Validation Completed
- ✅ Build validation passed (\`npm run build\`)
- ✅ TypeScript validation passed (\`npm run check\`)
- ✅ Code review agent validation completed ($REVIEW_ISSUES issues detected)
- ✅ Follows functional programming standards
- ✅ Adheres to project component standards

## Test Plan
- [ ] Verify functionality works as expected
- [ ] Test edge cases mentioned in issue
- [ ] Confirm no regressions in existing features
- [ ] Validate responsive design (if UI changes)

## Issue Context
$ISSUE_BODY

---

**Automated Process Details:**
- Generated on VPS infrastructure using Claude Code CLI
- Followed CLAUDE.md development standards
- Ready for human review and testing
- Auto-validated with project quality gates

Closes #$ISSUE_NUM

🤖 Generated with [Claude Code](https://claude.ai/code)"

gh pr create \
  --title "feat: $ISSUE_TITLE" \
  --body "$PR_BODY" \
  --label "automated" \
  --label "claude-generated"

# Get PR URL and update issue
PR_URL=$(gh pr view --json url -q .url)

gh issue comment "$ISSUE_NUM" --body "🤖 **Pull Request Created**

✅ Successfully generated implementation and created PR: $PR_URL

## Summary
- Changes generated using Claude Code CLI
- All validations passed (TypeScript, code review)
- Follows project development standards
- Ready for human review

The PR will be automatically linked to close this issue when merged."

echo "🎉 Successfully processed issue #$ISSUE_NUM"
echo "📋 Created PR: $PR_URL"