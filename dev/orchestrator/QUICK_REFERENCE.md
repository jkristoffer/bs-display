# AI Task Compiler - Quick Reference

## 🚀 No, You Don't Need Workflows!

### Single Task Commands (90% of use cases)

#### Create a Component
```bash
python3 orchestrator/run.py --task "feature/react-component:component_name=Button,component_description=Primary button component,category=common"
```

#### Create a Utility Function  
```bash
python3 orchestrator/run.py --task "function/utility:function_name=debounce,function_description=Debounce function calls"
```

#### Create an API Endpoint
```bash
python3 orchestrator/run.py --task "feature/api-endpoint:endpoint_path=/api/users,method=GET,endpoint_description=Get all users"
```

#### Add TypeScript Types
```bash
python3 orchestrator/run.py --task "refactor/add-types:file_path=src/utils/helpers.js,type_requirements=Add types to all functions"
```

#### Create Data Integration
```bash
python3 orchestrator/run.py --task "feature/data-integration:feature_name=UserLoader,data_source=/api/users,transformation_description=Transform to UI format"
```

## 📝 Common Examples

### Navigation Component
```bash
python3 orchestrator/run.py --task "feature/react-component:component_name=NavBar,component_description=Main navigation bar with links,category=layout"
```

### Form Validation Utility
```bash
python3 orchestrator/run.py --task "function/utility:function_name=validateEmail,function_description=Validate email format,function_signature=(email: string): boolean"
```

### User Profile Card
```bash
python3 orchestrator/run.py --task "feature/react-component:component_name=UserCard,component_description=Display user info in a card,category=user"
```

### Date Formatter
```bash
python3 orchestrator/run.py --task "function/utility:function_name=formatDate,function_description=Format dates to readable strings,function_signature=(date: Date, format?: string): string"
```

### Search Component
```bash
python3 orchestrator/run.py --task "feature/react-component:component_name=SearchBar,component_description=Search input with dropdown results,category=common"
```

## 🎯 When to Use What

### Use Single Tasks For:
- ✅ Individual components
- ✅ Utility functions
- ✅ API endpoints
- ✅ Adding types to files
- ✅ Simple features

### Use Workflows Only For:
- ✅ Multi-component features (3+ related components)
- ✅ Complex coordinated systems
- ✅ Reusable feature templates

## 💡 Pro Tips

### 1. Always Dry Run First
```bash
python3 orchestrator/run.py --task "..." --dry-run
```

### 2. Use Verbose for Details
```bash
python3 orchestrator/run.py --task "..." --verbose
```

### 3. Interactive Mode
```bash
python3 orchestrator/interactive.py
```

### 4. Shell Aliases (add to ~/.bashrc or ~/.zshrc)
```bash
# Quick AI Task Compiler commands
alias aic='python3 ~/git/bs-display/dev/orchestrator/run.py --task'
alias aic-dry='python3 ~/git/bs-display/dev/orchestrator/run.py --dry-run --task'

# Usage:
# aic "feature/react-component:component_name=Button,category=common"
# aic-dry "function/utility:function_name=debounce"
```

### 5. Common Patterns

**Component with Props**
```bash
# The orchestrator will ask Claude to determine appropriate props
python3 orchestrator/run.py --task "feature/react-component:component_name=ProductCard,component_description=Display product with image title price and add to cart button,category=products"
```

**Utility with Specific Signature**
```bash
python3 orchestrator/run.py --task "function/utility:function_name=groupBy,function_signature=<T, K>(items: T[], key: (item: T) => K): Record<K, T[]>"
```

**API with Request Body**
```bash
python3 orchestrator/run.py --task "feature/api-endpoint:endpoint_path=/api/users,method=POST,endpoint_description=Create new user with email and password"
```

## 📊 Output Structure

After running a task:
```
orchestrator/output/
└── 20250629_160230/          # Session ID
    ├── results.json          # Summary with scores
    ├── feature_react-component_prompt.md  # What Claude saw
    └── feature_react-component/
        ├── Button.tsx        # Generated component
        ├── Button.module.scss # Styles
        └── index.ts          # Exports
```

## 🔍 Check Results
```bash
# View latest results
cat orchestrator/output/*/results.json | tail -100

# Find specific component
find orchestrator/output -name "Button.tsx" -type f

# Check code quality scores
grep -r "average_score" orchestrator/output/*/results.json
```

## ❓ FAQ

**Q: Do I need to specify all props for components?**
A: No, Claude will infer appropriate props from your description.

**Q: Can I modify templates?**
A: Yes! Edit files in `orchestrator/templates/`

**Q: What if generation fails?**
A: Check logs in `orchestrator/logs/[session_id].log`

**Q: Can I regenerate with changes?**
A: Yes, just run again with updated parameters

**Q: How do I use generated code?**
A: Copy from `output/[session]/` to your `src/` directory

---

Remember: **Start simple with single tasks!** Workflows are optional for complex features.