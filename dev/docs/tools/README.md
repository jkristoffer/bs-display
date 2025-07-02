# Tools & Automation

**Comprehensive automation toolset for development productivity and code quality.**

This section covers all automation tools available in the project, from code review to content generation and infrastructure management.

---

## ⚡ Quick Access

### **Most Used Tools**
```bash
npm run help                           # Show all available commands
npm run code:review -- --file [path]  # Code review agent
npm run git:commit                     # Intelligent git workflow
npm run rag:query -- "your question"  # Project memory queries
```

### **Tool Categories**
- **[Code Quality](#-code-quality)** - Automated review and standards enforcement
- **[Content Automation](#-content-automation)** - Blog generation and SEO optimization
- **[Git Workflow](#-git-workflow)** - Intelligent commit and PR management
- **[Infrastructure](#-infrastructure)** - VPS and deployment automation
- **[AI Integration](#-ai-integration)** - RAG system and MCP servers

---

## 🔍 Code Quality

### **Code Review Agent**
Automated code review with standards compliance checking.

```bash
# Review specific file
npm run code:review -- --file src/components/YourComponent.tsx

# Review entire directory
npm run code:review -- --batch src/components/

# JSON output for parsing
npm run code:review -- --file test.js --json

# Batch review with progress tracking
npm run code:review -- --batch src/ --progress
```

**Features:**
- **Standards Compliance** - Functional programming patterns
- **TypeScript Analysis** - Type safety and interface design
- **Performance Checks** - Component optimization recommendations
- **Security Scanning** - Vulnerability detection
- **Documentation Review** - Comment and documentation quality

### **Static Analysis Tools**
```bash
# TypeScript compilation check
npm run code:typecheck

# Build verification
npm run dev:build

# Fast build (skip image optimization)
npm run dev:build:fast
```

---

## 📝 Content Automation

### **Blog Generation**
AI-powered blog post creation with SEO optimization.

```bash
# Generate new blog post
npm run content:blog:generate

# SEO analysis of existing content
npm run content:seo:analyze -- --file src/content/blog/post.md

# SEO optimization recommendations
npm run content:seo:optimize -- --file src/content/blog/post.md
```

**Blog Generation Features:**
- **Topic Research** - Industry trends and keyword analysis
- **Content Creation** - Structured, SEO-optimized articles
- **Image Suggestions** - Relevant visual content recommendations
- **Meta Optimization** - Titles, descriptions, and tags
- **Internal Linking** - Cross-reference with existing content

### **SEO Tools**
```bash
# Comprehensive SEO analysis
npm run content:seo:analyze -- --file [markdown-file]

# Batch SEO analysis
npm run content:seo:analyze -- --batch src/content/blog/

# SEO performance tracking
npm run content:seo:track
```

---

## 🔄 Git Workflow

### **Intelligent Commit System**
AI-powered commit message generation and workflow automation.

```bash
# Intelligent commit workflow
npm run git:commit

# Dry-run mode (preview without committing)
npm run git:commit -- --dry-run

# Verbose output for debugging
npm run git:commit -- --verbose
```

**Commit Workflow Features:**
- **Change Analysis** - Understands code modifications
- **Message Generation** - Descriptive, conventional commits
- **Context Awareness** - Project-specific commit patterns
- **Quality Checks** - Pre-commit validation
- **Co-authorship** - AI collaboration attribution

### **Repository Management**
```bash
# Repository status in JSON format
npm run git:status:json

# Branch management
npm run git:branch:list
npm run git:branch:cleanup

# Commit history analysis
npm run git:log:analyze
```

---

## 🏗️ Infrastructure

### **VPS Management**
Automated infrastructure provisioning and management.

```bash
# Spin up new VPS instance
npm run vps:spinup

# Clean up resources
npm run vps:cleanup

# Dry-run cleanup (preview actions)
npm run vps:cleanup -- --dry-run

# Comprehensive VPS management
npm run vps:manage
```

**VPS Features:**
- **Automated Provisioning** - DigitalOcean droplet creation
- **Snapshot Management** - Backup and restore operations
- **Cost Monitoring** - Resource usage tracking
- **Security Hardening** - Automated security configurations
- **Load Testing** - Performance validation

### **Deployment Tools**
```bash
# Vercel deployment
npm run deploy:vercel

# Preview deployment
npm run deploy:preview

# Deployment status
npm run deploy:status
```

---

## 🧠 AI Integration

### **RAG Project Memory**
AI-powered project knowledge and contextual queries.

```bash
# Query project knowledge
npm run rag:query -- "How does the ProductCard component work?"
npm run rag:query -- "Authentication implementation details"
npm run rag:query -- "SEO best practices for this project"

# System maintenance
npm run rag:setup     # Initial setup
npm run rag:clean     # Clean and re-index
npm run rag:status    # System health check
```

**RAG Features:**
- **Codebase Indexing** - Full project knowledge base
- **Contextual Queries** - Project-specific answers
- **Code Pattern Recognition** - Implementation examples
- **Documentation Integration** - Comprehensive knowledge access
- **Learning Acceleration** - Fast onboarding and problem-solving

### **MCP Integration**
Model Context Protocol servers for specialized AI capabilities.

```bash
# PDF analysis setup
npm run mcp:pdf:setup
npm run mcp:pdf:build
npm run mcp:pdf:test

# Claude Code integration
npm run mcp:claude:add
npm run mcp:claude:list
npm run mcp:claude:remove
```

---

## 📊 Performance & Monitoring

### **Performance Tracking**
```bash
# AI agent performance metrics
npm run ai:performance

# Build performance analysis
npm run dev:build:analyze

# Development server performance
npm run dev:server:profile
```

### **System Monitoring**
```bash
# Tool availability check
npm run ai:tools:list

# System health check
npm run system:health

# Automation status
npm run automation:status
```

---

## 🔧 Tool Configuration

### **Environment Setup**
```bash
# Verify tool prerequisites
npm run tools:verify

# Setup development environment
npm run tools:setup

# Update tool dependencies
npm run tools:update
```

### **Custom Tool Development**
```bash
# Create new automation tool
npm run tools:create -- --name "tool-name"

# Test custom tool
npm run tools:test -- --tool "tool-name"

# Deploy custom tool
npm run tools:deploy -- --tool "tool-name"
```

---

## 🎯 Tool Integration Workflows

### **Development Workflow Integration**
```bash
# Morning setup
npm run help && npm run git:status:json

# During development
npm run code:review -- --file [modified-file]

# Before commit
npm run git:commit

# End of day
npm run code:review -- --batch src/
```

### **Content Creation Workflow**
```bash
# Research and generate
npm run content:blog:generate

# SEO optimization
npm run content:seo:analyze -- --file [new-post]

# Quality review
npm run code:review -- --file [content-file]

# Commit and deploy
npm run git:commit
```

### **Infrastructure Management Workflow**
```bash
# Environment provisioning
npm run vps:spinup

# Deployment
npm run deploy:vercel

# Monitoring
npm run vps:manage

# Cleanup
npm run vps:cleanup -- --dry-run
```

---

## 🔍 Advanced Tool Usage

### **[Code Quality Deep Dive](./code-quality.md)**
Comprehensive code review configuration and customization

### **[Content Automation Guide](./content-automation.md)**
Advanced blog generation and SEO optimization techniques

### **[Git Workflow Mastery](./git-workflow.md)**
Advanced git automation and workflow optimization

### **[Infrastructure Automation](./infrastructure.md)**
VPS management and deployment automation deep dive

### **[AI Tool Integration](./ai-integration.md)**
RAG system and MCP server advanced configuration

---

## 🆘 Tool Troubleshooting

### **Common Issues**

#### **Tool Not Found**
```bash
# Verify tool availability
npm run help

# Check specific tool status
npm run ai:tools:list

# Reinstall tool dependencies
npm run tools:setup
```

#### **Permission Issues**
```bash
# Check file permissions
ls -la scripts/

# Fix script permissions
chmod +x scripts/*.sh

# Verify execution permissions
./scripts/verbose-wrapper.sh --help
```

#### **Performance Issues**
```bash
# Check system resources
npm run system:health

# Analyze tool performance
npm run ai:performance

# Optimize tool configuration
npm run tools:optimize
```

### **Emergency Recovery**
```bash
# Reset tool configuration
npm run tools:reset

# Rebuild tool cache
npm run tools:rebuild

# Get emergency help
npm run rag:query -- "tool emergency recovery"
```

---

## 📈 Tool Metrics & Analytics

### **Usage Tracking**
- **Command Frequency** - Most used tools and patterns
- **Performance Metrics** - Tool execution times and success rates
- **Error Analysis** - Common failures and resolution patterns
- **Efficiency Gains** - Development velocity improvements

### **Optimization Insights**
```bash
# View tool usage statistics
npm run tools:stats

# Performance analysis
npm run tools:analyze

# Optimization recommendations
npm run tools:optimize:suggestions
```

---

**Ready to supercharge your development workflow? Start with the most relevant tools for your current task and gradually expand your automation toolkit.**

*Last updated: 2025-07-02*