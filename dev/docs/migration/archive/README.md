# Archived Documentation

These documents are outdated and have been replaced by the new unified tool interface.

## Archived Files

- **BLOG_AUTOMATION_README.md** - Replaced by `npm run content:blog:generate` and COMMAND_REFERENCE.md
- **CODE_REVIEW_AGENT.md** - Replaced by `npm run code:review` and AI_DEVELOPER_GUIDE.md  
- **SEO_QUICK_REFERENCE.md** - Replaced by `npm run content:seo:*` commands and COMMAND_REFERENCE.md

## Current Documentation

For up-to-date information, see:
- [COMMAND_REFERENCE.md](../../COMMAND_REFERENCE.md) - Complete command listing
- [AI_DEVELOPER_GUIDE.md](../../AI_DEVELOPER_GUIDE.md) - AI-specific workflows
- [MIGRATION_GUIDE.md](../../MIGRATION_GUIDE.md) - Transition from old commands
- [CLAUDE.md](../../CLAUDE.md) - AI development guidelines

## Why These Files Were Archived

The old documentation referenced tools and interfaces that have been deprecated:
- Slash commands (`/commit`, `/code-review`) - no longer work
- Direct script execution (`./scripts/commit`) - shows deprecation warnings
- Old npm script names (`npm run tools:*`) - replaced with consistent naming

The new unified interface provides:
- **Consistency**: All commands use `npm run [category]:[action]` pattern
- **AI-Friendly Features**: Dry-run, JSON output, verbose logging
- **Better Discovery**: `npm run help` shows everything available
- **Comprehensive Documentation**: Single source of truth for all commands