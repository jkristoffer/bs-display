# Deprecation Timeline

This document outlines the planned removal schedule for deprecated tool interfaces in the BS Display project.

---

## Phase 1: Soft Deprecation (✅ Current - Completed)
**Status**: ✅ **COMPLETED**  
**Duration**: Implemented during tool consolidation project

### What Changed:
- ✅ Deprecation warnings added to all direct script execution
- ✅ New npm interface available for all tools  
- ✅ Documentation updated to reflect new commands
- ✅ Old interfaces still work but show warnings

### Impact:
- Old scripts show 3-second warning before executing
- All functionality preserved during transition
- Users can gradually adopt new commands
- AI agents can learn new patterns

---

## Phase 2: Hard Deprecation (🔄 Planned - 30 days)
**Status**: 🔄 **PLANNED**  
**Target Date**: ~30 days from consolidation completion

### What Will Change:
- Direct script execution will fail with helpful error messages
- Only npm commands will work
- Clear error messages guide users to correct commands
- All functionality preserved through npm interface

### Commands Affected:
```bash
# These will FAIL with helpful error:
./scripts/commit
node scripts/code-review-agent.js --file test.js
./vps-scripts/spin-up.sh

# Users must use:
npm run git:commit
npm run code:review -- --file test.js
npm run vps:spinup
```

### Migration Support:
- Error messages include exact npm command to use
- Help system provides guidance: `npm run help`
- Migration guide available: `MIGRATION_GUIDE.md`

---

## Phase 3: Removal (📅 Planned - 60 days)
**Status**: 📅 **PLANNED**  
**Target Date**: ~60 days from consolidation completion

### What Will Change:
- Old scripts moved to `archive/` directory
- Only npm interface remains
- Clean, consistent interface
- Repository cleanup complete

### Benefits:
- No confusing multiple interfaces
- AI agents have single predictable pattern
- Maintenance simplified
- Documentation consolidated

---

## Affected Commands Summary

### Slash Commands (Already Removed)
```bash
# NO LONGER WORK (removed in Phase 1):
/commit
/code-review --file [path]
/seo-analyze --file [path]

# REPLACEMENT:
npm run git:commit
npm run code:review -- --file [path]
npm run content:seo:analyze -- --file [path]
```

### Direct Script Execution (Current: Warnings)
```bash
# PHASE 1 (current): Shows warnings
./scripts/commit
node scripts/code-review-agent.js
./vps-scripts/spin-up.sh

# PHASE 2 (30 days): Will fail with helpful errors
# PHASE 3 (60 days): Scripts moved to archive/
```

### Old NPM Scripts (Already Cleaned)
```bash
# NO LONGER WORK (removed in Phase 1):
npm run tools
npm run tools:code-review
npm run tools:blog-generate

# REPLACEMENT:
npm run help
npm run code:review
npm run content:blog:generate
```

---

## Communication Plan

### For Developers
- **Phase 1**: Documentation updated, migration guide available
- **Phase 2**: Error messages provide exact replacement commands
- **Phase 3**: Clean interface, no legacy references

### For AI Agents
- **Phase 1**: New patterns available, old patterns show warnings
- **Phase 2**: Only new patterns work, predictable error handling
- **Phase 3**: Single consistent interface: `npm run [category]:[action]`

---

## Validation & Rollback

### Validation at Each Phase
```bash
# Test current state
node scripts/validate-cleanup.js

# Test all tools work
npm run ai:validate:all

# Test AI features
npm run ai:validate:dry
```

### Rollback Plan (If Needed)
```bash
# Emergency rollback during Phase 2
git checkout [previous-commit] -- scripts/
git checkout [previous-commit] -- package.json

# Restore functionality immediately
```

---

## Success Metrics

### Phase 1 Success Criteria (✅ Met)
- [x] All tools accessible via npm interface
- [x] Deprecation warnings show for direct usage
- [x] Documentation reflects new commands
- [x] AI validation passes 100%
- [x] No functionality lost

### Phase 2 Success Criteria
- [ ] Direct scripts fail with helpful errors
- [ ] All npm commands work perfectly
- [ ] Error messages guide to correct usage
- [ ] AI agents adapt to new interface
- [ ] User feedback positive

### Phase 3 Success Criteria  
- [ ] Single interface only
- [ ] All documentation clean
- [ ] Repository structure simplified
- [ ] AI agents use predictable patterns
- [ ] Maintenance burden reduced

---

## Current Status Check

Run this command to verify current state:
```bash
node scripts/validate-cleanup.js
```

Expected output: **8/8 checks passed** ✅

---

## Emergency Contacts

If issues arise during transition:
- Check `AI_DEVELOPER_GUIDE.md` for troubleshooting
- Run `npm run help` to see all available commands
- Use `npm run ai:validate:all` to test everything
- Review `MIGRATION_GUIDE.md` for command mappings

---

## Timeline Summary

| Phase | Duration | Status | Key Change |
|-------|----------|--------|------------|
| **Phase 1** | Current | ✅ Complete | Warnings added, new interface available |
| **Phase 2** | +30 days | 🔄 Planned | Direct scripts fail, npm-only |
| **Phase 3** | +60 days | 📅 Planned | Scripts archived, clean interface |

**Next Action**: Monitor usage patterns and prepare for Phase 2 implementation.