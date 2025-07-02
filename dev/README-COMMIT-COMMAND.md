# 🚀 BS Display Git Commands

**Note**: Slash commands have been deprecated. Use the unified npm interface instead.

## **Current Method: Unified NPM Interface (Recommended)**

### Basic Usage:
```bash
npm run git:commit          # Smart commit with conventional format
npm run git:status          # Check repository status
npm run git:push            # Push to remote
```

### AI-Enhanced Usage:
```bash
npm run git:commit:ai -- --dry-run    # Preview commit without executing
npm run git:commit:ai -- --json       # JSON output for parsing
npm run git:commit:ai -- --verbose    # Detailed execution logs
npm run git:status:json               # Structured status output
```

### Setup:
✅ **Already configured** - No additional setup required

- **Consistent**: Same pattern as all other tools (`npm run [category]:[action]`)
- **AI-Friendly**: Predictable interface with dry-run, JSON, and verbose modes
- **Fast**: 2-5 seconds for intelligent commits
- **Discoverable**: `npm run help` shows all available commands

---

## **Deprecated Methods**

### ~~Method 1: Slash Commands~~ (Removed)
```bash
# These no longer work:
/project:commit
/user:fastcommit
```

### ~~Method 2: Direct Scripts~~ (Deprecated)
```bash
# Still works but shows deprecation warning:
./scripts/commit
```

- Works in **any git repository**
- Uses Claude AI to analyze changes and generate commits
- Takes 10-20 seconds but works everywhere

---

## **Method 3: Direct Script Execution**

### Usage:
```bash
./scripts/commit
```

### Features:
- **Fastest**: 2-5 seconds
- **Local script**: No Claude AI needed
- **Intelligent**: Conventional commit format
- **Filtering**: Excludes logs, temp files

---

## **Method 4: Global Command**

### Setup:
```bash
./install-global-commit.sh
```

### Usage from anywhere:
```bash
commit
```

---

## **🎯 Comparison:**

| Method | Speed | Scope | Intelligence | Dependencies | Setup |
|--------|-------|-------|--------------|--------------|--------|
| `/project:commit` | 2-5s | This project | High | **None** | ✅ Done |
| `/user:fastcommit` | 10-20s | Any project | Very High | Claude AI | ✅ Done |
| `./scripts/commit` | 2-5s | This project | High | Script file | ✅ Done |
| `commit` (global) | 2-5s | Any project | High | Script file | Run installer |

## **💡 Recommended Usage:**

- **In this project**: Use `/project:commit` for maximum speed and reliability
- **Other projects**: Use `/user:fastcommit` for universal AI-powered commits
- **Command line**: Use `./scripts/commit` for direct execution

## **✨ Key Advantage of Method 1:**
**Self-contained design** means the slash command is **bulletproof** - it will work even if:
- Script files get deleted
- Directory structure changes  
- External dependencies break
- You move the `.claude/commands/commit.md` to other projects

All methods are **10-30x faster** than the old GitHub Actions approach (45-90s)! 🚀