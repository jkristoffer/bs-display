# RAG Project Memory - Quick Reference

**Fast access guide for daily development with RAG-powered project memory.**

📋 **Navigation**: [← RAG System Guide](./RAG_PROJECT_MEMORY_GUIDE.md) | [RAG Architecture →](./RAG_SYSTEM_OVERVIEW.md) | [↑ Documentation Hub](./README.md)

---

## ⚡ Essential Commands

### **Claude Code Integration**
```bash
# General project queries
/gemini "How does [component] work?"
/gemini "What's the data flow for [feature]?"
/gemini "Show me [pattern] usage in this project"

# Debugging with context
/debug "[error description]"
/debug "Build failing with [specific error]"
/debug "[component] not working as expected"

# Code review against standards
/review "[component] for functional programming"
/review "[file] architecture patterns"
/review "[feature] implementation quality"

# Architecture guidance
/architect "implementing [new feature]"
/architect "best approach for [requirement]"
/architect "optimizing [system component]"

# Maintenance
/gemini-update                  # Re-ingest after major changes
```

### **Direct Script Usage**
```bash
cd rag

# Quick queries
./gemini_rag_clean.sh query --query "Your question here"

# Project management
./gemini_rag_clean.sh ingest --project-root /path/to/project
./gemini_rag_clean.sh update --project-root /path/to/project
```

---

## 🎯 Query Examples by Use Case

### **Component Understanding**
```bash
/gemini "What React components are in the products directory?"
/gemini "How does ProductCard handle product data?"
/gemini "What props does the Quiz component accept?"
/gemini "Show me the component hierarchy for filtering"
```

### **Data & State Management**
```bash
/gemini "How is product data structured in this project?"
/gemini "What's the state management pattern for Quiz?"
/gemini "How does filtering state work across components?"
/gemini "Show me all data fetching patterns used"
```

### **Styling & Design**
```bash
/gemini "What SCSS patterns are used in this project?"
/gemini "How are CSS modules organized?"
/gemini "Show me the design system components"
/gemini "What styling approach is used for responsive design?"
```

### **Debugging Scenarios**
```bash
/debug "TypeScript errors in Quiz component"
/debug "Images not loading on product pages"
/debug "Build failing with SCSS imports"
/debug "FilterUI component state not updating"
/debug "Routing issues with dynamic product pages"
```

### **Code Review Focus Areas**
```bash
/review "ProductCard for functional programming standards"
/review "Quiz component TypeScript interfaces"
/review "FilterUI state management patterns"
/review "SCSS modules organization and naming"
/review "Product data handling consistency"
```

### **Architecture Planning**
```bash
/architect "adding user authentication system"
/architect "implementing shopping cart functionality"
/architect "optimizing image loading performance"
/architect "adding real-time product updates"
/architect "implementing search functionality"
```

---

## 🔧 Troubleshooting

### **Common Issues & Quick Fixes**

| Issue | Quick Fix |
|-------|-----------|
| "API key not found" | `cat rag/.env` → Verify API key exists |
| "No relevant chunks" | `/gemini-update` → Re-ingest project |
| "Script not executable" | `chmod +x rag/gemini_rag_clean.sh` |
| "Virtual env issues" | `cd rag && source venv/bin/activate` |
| "Telemetry errors" | Use `gemini_rag_clean.sh` (not `gemini_rag_cli.py`) |

### **Quick Health Check**
```bash
# Test API connection
cd rag && python3 test_gemini_free.py

# Check database exists
ls -la rag/chroma_db/

# Test query functionality  
./gemini_rag_clean.sh query --query "test connection"
```

---

## 📊 Performance Expectations

| Operation | Expected Time | Notes |
|-----------|---------------|-------|
| **Query Response** | 3-5 seconds | Including context retrieval |
| **Initial Ingestion** | 2-5 minutes | Full BS Display project |
| **Re-ingestion** | 2-5 minutes | After major changes |
| **API Rate Limit** | 1,500/minute | Google Gemini free tier |

---

## 💡 Pro Tips

### **Query Optimization**
- ✅ **Be specific**: "ProductCard component structure" vs "how components work"
- ✅ **Use context**: "DEBUG: TypeScript errors in FilterUI" vs "TypeScript errors"
- ✅ **Reference files**: "Review ProductCard.tsx patterns" vs "review code"
- ✅ **Ask follow-ups**: Build on previous responses for deeper understanding

### **Workflow Integration**
- 🔄 **Re-ingest** after major code changes or new features
- 🧪 **Test queries** when learning new parts of the codebase
- 📝 **Document patterns** discovered through RAG queries
- 🤝 **Share useful queries** with team members

### **Best Practices**
- 🎯 **Start broad, get specific**: "How does filtering work?" → "How does FilterPanel.tsx handle state updates?"
- 🔍 **Use for onboarding**: New team members can quickly understand architecture
- 🏗️ **Plan before coding**: Use `/architect` before implementing new features
- 🐛 **Debug systematically**: Use `/debug` to understand error context before fixing

---

## 🔗 Related Files

- **[Full Documentation](./RAG_PROJECT_MEMORY_GUIDE.md)**: Comprehensive guide
- **[Main AI Guide](../CLAUDE.md)**: Project AI development standards
- **[Emergency Procedures](../EMERGENCY_PROCEDURES.md)**: System recovery

---

**Keep this reference handy for daily development - transform every question into a project-aware interaction!**

*Last Updated: 2024-06-30*