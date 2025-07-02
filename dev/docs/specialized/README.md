# Specialized Systems

**Domain-specific tools and workflows for advanced automation and development.**

This section covers the four major specialized systems: Forge (AI development), VPS Management, RAG Project Memory, and MCP Integration.

---

## 🎯 System Overview

### **[Forge System](./forge/README.md)**
**AI-driven development automation and code generation**
- Autonomous task execution
- Code generation and review
- Test automation
- Development workflow optimization

### **[VPS Management](./vps/README.md)** 
**Infrastructure provisioning and management automation**
- DigitalOcean integration
- Automated provisioning and cleanup
- Cost optimization
- Performance monitoring

### **[RAG Project Memory](./rag/README.md)**
**AI project memory and contextual query system**
- Codebase knowledge indexing
- Natural language project queries
- Context-aware assistance
- Learning acceleration

### **[MCP Integration](./mcp/README.md)**
**Model Context Protocol servers and Claude Code integration**
- PDF analysis capabilities
- Custom tool development
- Claude Code server management
- AI workflow enhancement

---

## ⚡ Quick Access Commands

### **Forge Operations**
```bash
# Task execution
python forge/forge.py --task "implement login component"
python forge/forge.py --file src/components/Auth.tsx --action review

# Testing and validation
npm run forge:test
npm run forge:validate
```

### **VPS Management**
```bash
# Infrastructure operations
npm run vps:spinup          # Create new VPS instance
npm run vps:cleanup         # Clean up resources
npm run vps:manage          # Interactive management
npm run vps:status          # Check current status
```

### **RAG System**
```bash
# Knowledge queries
npm run rag:query -- "How does authentication work?"
npm run rag:query -- "Product data schema explanation"
npm run rag:query -- "Component testing patterns"

# System maintenance
npm run rag:setup           # Initial setup
npm run rag:clean           # Re-index knowledge base
```

### **MCP Integration**
```bash
# PDF analysis
npm run mcp:pdf:setup       # Setup PDF analyzer
npm run mcp:pdf:build       # Build MCP server
npm run mcp:pdf:test        # Test functionality

# Claude Code integration
npm run mcp:claude:add      # Add server to Claude Code
npm run mcp:claude:list     # List configured servers
```

---

## 🔄 System Integration

### **Workflow Interconnections**
```
RAG System ←→ Forge ←→ Code Review ←→ Git Commit
     ↓           ↓           ↓           ↓
   Query    Generate    Validate    Deploy
   Context    Code      Quality      VPS
```

### **Cross-System Operations**
```bash
# Comprehensive development workflow
npm run rag:query -- "authentication best practices"
python forge/forge.py --task "implement auth with best practices"
npm run code:review -- --file src/components/Auth.tsx
npm run git:commit
npm run vps:deploy
```

---

## 🎯 Use Case Scenarios

### **New Feature Development**
```bash
# 1. Research existing patterns
npm run rag:query -- "similar feature implementations"

# 2. Generate initial implementation
python forge/forge.py --task "create feature scaffold"

# 3. Review and refine
npm run code:review -- --file [generated-files]

# 4. Deploy and test
npm run vps:spinup  # Test environment
npm run deploy:test
```

### **Bug Investigation**
```bash
# 1. Query known issues
npm run rag:query -- "error: [error-message]"

# 2. Analyze codebase
python forge/forge.py --file [problematic-file] --action analyze

# 3. Generate fix
python forge/forge.py --task "fix issue: [description]"

# 4. Validate solution
npm run code:review -- --file [fixed-file]
```

### **Performance Optimization**
```bash
# 1. Query performance patterns
npm run rag:query -- "performance optimization techniques"

# 2. Analyze current performance
npm run vps:profile  # Performance profiling

# 3. Generate optimizations
python forge/forge.py --task "optimize performance for [component]"

# 4. Validate improvements
npm run vps:load-test
```

---

## 🏗️ System Architecture

### **Data Flow**
```
User Request → RAG Query → Context Enrichment → Forge Processing → Code Generation → Review → VPS Deployment
```

### **Knowledge Graph**
```
Project Files → RAG Indexing → Knowledge Base ← Query Interface ← User/AI Agents
```

### **Automation Pipeline**
```
Code Changes → Forge Analysis → Quality Review → Git Integration → VPS Deployment → Monitoring
```

---

## 🔧 System Configuration

### **Environment Requirements**
```bash
# Forge requirements
python 3.8+
pip install -r forge/requirements.txt

# RAG requirements  
pip install -r rag/requirements.txt
# OR local setup
pip install -r rag/requirements_local.txt

# VPS requirements
doctl (DigitalOcean CLI)
ssh key configuration

# MCP requirements
npm (for server building)
Gemini CLI (for PDF analysis)
```

### **API Configuration**
```bash
# Environment variables needed
OPENAI_API_KEY          # For Forge AI operations
GEMINI_API_KEY          # For RAG queries (optional)
DIGITALOCEAN_TOKEN      # For VPS management
ANTHROPIC_API_KEY       # For MCP integration
```

---

## 📊 System Monitoring

### **Performance Metrics**
```bash
# Forge performance
python forge/forge.py --stats

# RAG system health
npm run rag:health

# VPS resource usage
npm run vps:monitor

# MCP server status
npm run mcp:status
```

### **System Health Checks**
```bash
# Overall system status
npm run systems:health

# Individual system checks
npm run forge:check
npm run rag:check
npm run vps:check
npm run mcp:check
```

---

## 🎓 Learning & Onboarding

### **Getting Started**
1. **Start with RAG** - Build project knowledge
2. **Explore Forge** - Understand AI automation
3. **Learn VPS** - Infrastructure management
4. **Integrate MCP** - Advanced AI capabilities

### **Progressive Learning Path**
```bash
# Week 1: RAG System mastery
npm run rag:query -- "project architecture overview"
npm run rag:query -- "development workflows"

# Week 2: Forge integration
python forge/forge.py --task "simple component creation"
python forge/forge.py --help

# Week 3: VPS management
npm run vps:spinup -- --dry-run
npm run vps:manage

# Week 4: MCP integration
npm run mcp:pdf:setup
npm run mcp:claude:add
```

---

## 🔍 Advanced Usage

### **Custom System Extensions**
```bash
# Extend Forge capabilities
# Edit forge/forge.py or create plugins

# Add RAG data sources
# Configure additional indexing paths

# Custom VPS configurations
# Modify vps-scripts/ for specific needs

# MCP server development
# Create new servers in scripts/mcp-servers/
```

### **System Integration Patterns**
```python
# Example: RAG-informed Forge task
query_result = rag_query("authentication patterns")
forge_task = f"implement auth using: {query_result}"
execute_forge_task(forge_task)
```

---

## 🆘 System Troubleshooting

### **Common Issues**

#### **Forge Issues**
```bash
# Check Python environment
python --version
pip list

# Verify dependencies
pip install -r forge/requirements.txt

# Debug mode
python forge/forge.py --debug --task "test task"
```

#### **RAG Issues**
```bash
# Check system status
npm run rag:status

# Rebuild knowledge base
npm run rag:clean

# Local fallback
python rag/gemini_rag_cli_local.py "test query"
```

#### **VPS Issues**
```bash
# Verify credentials
doctl auth list

# Check prerequisites
npm run vps:check

# Debug mode
npm run vps:manage -- --debug
```

#### **MCP Issues**
```bash
# Verify server build
npm run mcp:pdf:build

# Test server functionality
npm run mcp:pdf:test

# Check Claude Code integration
npm run mcp:claude:list
```

### **Emergency Recovery**
```bash
# System reset procedures
npm run systems:reset

# Individual system recovery
npm run forge:reset
npm run rag:reset
npm run vps:reset
npm run mcp:reset
```

---

## 📈 System Evolution

### **Planned Enhancements**
- **Multi-AI Workflows** - Orchestrated AI agent collaboration
- **Advanced Analytics** - System performance optimization
- **Custom Integrations** - Third-party tool connections
- **Automated Learning** - Self-improving system capabilities

### **Contribution Opportunities**
- **System Extensions** - Add new capabilities
- **Performance Optimization** - Improve system efficiency
- **Documentation** - Enhance user guides
- **Testing** - Expand system validation

---

**Ready to leverage specialized systems for advanced development workflows? Start with the system most relevant to your current needs and gradually integrate others.**

*Last updated: 2025-07-02*