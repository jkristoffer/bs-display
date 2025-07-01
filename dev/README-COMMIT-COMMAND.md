# 🚀 Claude Code Fast Commit Commands

Multiple ways to use intelligent fast git commits with Claude Code!

## **Method 1: Project-Specific Slash Command (Recommended)**

### Usage:
```bash
/project:commit
```

### Setup:
✅ **Already configured** in this project at `.claude/commands/commit.md`

- Runs the local script in **2-5 seconds**
- Works only in this project directory
- Uses our optimized bash script with intelligent analysis

---

## **Method 2: Universal Slash Command**

### Usage:
```bash
/user:fastcommit
```

### Setup:
✅ **Already configured** globally at `~/.claude/commands/fastcommit.md`

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

| Method | Speed | Scope | Intelligence | Setup |
|--------|-------|-------|--------------|--------|
| `/project:commit` | 2-5s | This project | High | ✅ Done |
| `/user:fastcommit` | 10-20s | Any project | Very High | ✅ Done |
| `./scripts/commit` | 2-5s | This project | High | ✅ Done |
| `commit` (global) | 2-5s | Any project | High | Run installer |

## **💡 Recommended Usage:**

- **In this project**: Use `/project:commit` for maximum speed
- **Other projects**: Use `/user:fastcommit` for universal AI-powered commits
- **Command line**: Use `./scripts/commit` for direct execution

All methods are **10-30x faster** than the old GitHub Actions approach (45-90s)! 🚀