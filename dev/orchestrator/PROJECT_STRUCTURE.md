# AI Task Compiler - Project Structure

## Directory Layout

```
orchestrator/
├── ai                          # Symlink to ai-working.py (quick generation)
├── run.py                      # Main orchestrator (original)
├── cleanup.py                  # Cleanup utility
│
├── Core Scripts/
│   ├── ai-working.py          # ✅ Production - Direct template generation
│   ├── ai-orchestrated.py     # ✅ Production - Full pipeline with validation
│   ├── ai-smart.py            # Smart intent detection
│   ├── ai-complete.py         # Claude-powered task generation
│   └── ai-final.py            # Simplified keyword approach
│
├── Utilities/
│   ├── claude_output_parser.py     # Original Claude output parser
│   ├── enhanced_claude_parser.py   # Multi-format parser
│   └── review-and-fix.py          # Code review functionality
│
├── templates/                  # Prompt templates
│   ├── feature/
│   │   ├── react-component.md
│   │   ├── api-endpoint.md
│   │   └── data-integration.md
│   ├── function/
│   │   └── utility.md
│   └── refactor/
│       └── add-types.md
│
├── output/                     # Generated outputs (git-ignored)
│   └── [session_id]/
│       ├── results.json
│       └── feature_react-component/
│
├── logs/                       # Execution logs (git-ignored)
│   └── [session_id].log
│
└── Documentation/
    ├── README.md                        # Original documentation
    ├── ORCHESTRATION_GUIDE.md          # Full vs Quick mode guide
    ├── AI_COMPLETE_GUIDE.md            # Intent detection guide
    ├── AI_POWERED_README.md            # AI features overview
    ├── FAQ_GENERATION_SOLUTION.md      # FAQ example walkthrough
    └── AI_WORKING_SOLUTION.md          # Working implementation details
```

## Quick Reference

### For Users

**Quick Generation (Most Common)**
```bash
./ai "build a FAQ page"        # Generates files in output/
./ai "create a button"         # Simple component generation
./ai "make a search bar"       # Instant results
```

**Full Orchestration (Production)**
```bash
./ai-pro "build a FAQ page"    # Complete pipeline:
                               # - Generate
                               # - Validate
                               # - Test
                               # - Integrate
                               # - Create PR
```

### For Developers

**Main Entry Points:**
- `ai-working.py` - Template-based generation (reliable, fast)
- `ai-orchestrated.py` - Full pipeline implementation
- `run.py` - Original orchestrator with Claude CLI

**Key Components:**
- Templates in `templates/` - Modify for different outputs
- Parsers handle Claude output variations
- Validation checks TypeScript, accessibility, standards

## Maintenance

**Regular Cleanup:**
```bash
python3 cleanup.py  # Removes test outputs, old sessions
```

**Check Outputs:**
```bash
ls -la output/      # Recent generation sessions
ls -la logs/        # Execution logs
```

## Integration Points

1. **Templates** - Add new templates for different component types
2. **Validation** - Extend validation in ai-orchestrated.py
3. **Tests** - Hook up real test runners
4. **Git Workflow** - Customize branch naming, PR templates

## Current Status

✅ **Working:**
- Quick component generation
- Full orchestration pipeline
- Multiple component types (FAQ, Button, SearchBar)
- Git integration (branch, commit)

🚧 **Planned:**
- Real test execution (currently simulated)
- More component templates
- CI/CD integration
- Visual regression testing