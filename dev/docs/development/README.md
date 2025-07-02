# Development Guide

**Comprehensive development workflows and standards for the BS Display project.**

This section covers everything you need for productive daily development, from code standards to testing strategies.

---

## 🔄 Daily Workflow

### **Morning Setup**
```bash
# Update and check project status
git pull origin main
npm run git:status:json

# Start development environment
npm run dev:server

# Check for system updates
npm run help
```

### **Development Cycle**
```bash
# Before coding - understand context
npm run rag:query -- "How does [feature] work?"

# During coding - continuous validation
npm run code:typecheck
npm run code:review -- --file [modified-file]

# After coding - quality assurance
npm run git:commit
```

### **End of Day**
```bash
# Final quality check
npm run code:review -- --batch src/
npm run dev:build

# Commit and push
npm run git:commit
git push origin [branch]
```

---

## 📋 Code Standards

### **[Component Standards](./standards/component-standards.md)**
- TypeScript-first development
- Functional programming patterns
- Reusable component architecture
- SCSS module styling

### **[File Naming Conventions](./standards/file-naming.md)**
- kebab-case for files and directories
- PascalCase for React components
- Consistent import/export patterns

### **[Styling Patterns](./standards/styling-patterns.md)**
- SCSS modules for component styling
- Design system variables
- Responsive design principles
- Performance optimization

### **[Data Management](./standards/data-management.md)**
- JSON schema validation
- TypeScript interface definitions
- Centralized data imports
- Type-safe data access

---

## 🏗️ Architecture Patterns

### **Component Architecture**
```typescript
// Pure functional components
interface ComponentProps {
  data: ProductData;
  onAction: (id: string) => void;
}

export const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  // Pure function logic
  return <div>{/* JSX */}</div>;
};
```

### **Data Flow**
```
JSON Schema → TypeScript Interfaces → React Props → Component Rendering
```

### **State Management**
- Local state with React hooks
- URL state for filters and navigation
- No global state management (keeping it simple)

### **Performance Optimization**
- Static generation with Astro
- Component lazy loading
- Image optimization
- Code splitting

---

## 🧪 Testing Strategies

### **Code Quality Automation**
```bash
# Automated code review
npm run code:review -- --file [path]
npm run code:review -- --batch src/components/

# TypeScript validation
npm run code:typecheck

# Build verification
npm run dev:build
```

### **Manual Testing**
- **Component Testing** - Verify UI behavior in isolation
- **Integration Testing** - Check component interactions
- **User Journey Testing** - Complete workflow validation
- **Performance Testing** - Build times and runtime performance

### **Quality Gates**
1. **Code Review Agent** - Automated standards compliance
2. **TypeScript Compilation** - Type safety verification
3. **Build Success** - Production readiness check
4. **Human Review** - Architecture and business logic validation

---

## 🔧 Development Tools

### **Primary Tools**
```bash
# Essential daily commands
npm run dev:server              # Development server
npm run code:review -- --file   # Code quality check
npm run git:commit              # Intelligent commits
npm run rag:query               # Project knowledge
```

### **Specialized Tools**
```bash
# Content creation
npm run content:blog:generate
npm run content:seo:analyze -- --file [path]

# Infrastructure
npm run vps:manage
npm run mcp:pdf:setup

# Advanced automation
python forge/forge.py --task "description"
```

### **Development Environment**
- **VS Code** with TypeScript and Astro extensions
- **Node.js 18+** for build tools
- **Chrome DevTools** for debugging
- **Vercel CLI** for deployment testing

---

## 📁 Project Structure Deep Dive

### **Source Organization**
```
src/
├── components/
│   ├── common/      # Reusable UI elements
│   ├── home/        # Homepage sections
│   ├── products/    # Product catalog features
│   ├── quiz/        # Interactive recommendation
│   └── blog/        # Content components
├── pages/           # Astro route definitions
├── data/            # Product data and schemas
├── content/         # Markdown content collections
├── styles/          # Global SCSS and variables
├── types/           # TypeScript definitions
└── utils/           # Shared utility functions
```

### **Configuration Files**
- `astro.config.mjs` - Framework configuration
- `tsconfig.json` - TypeScript settings
- `package.json` - Scripts and dependencies
- `eslint.config.mjs` - Code linting rules

---

## 🎯 Feature Development

### **Adding New Features**
1. **Plan** - Use TodoWrite for complex features
2. **Research** - Query project memory: `npm run rag:query`
3. **Design** - Follow component standards
4. **Implement** - Write TypeScript-first code
5. **Review** - Run code review agent
6. **Test** - Manual and automated validation
7. **Commit** - Use intelligent commit workflow

### **Component Development Lifecycle**
```bash
# 1. Create component structure
mkdir src/components/feature/NewComponent
touch src/components/feature/NewComponent/{index.ts,NewComponent.tsx,NewComponent.module.scss}

# 2. Implement with standards compliance
# [Write TypeScript component code]

# 3. Quality assurance
npm run code:review -- --file src/components/feature/NewComponent/NewComponent.tsx

# 4. Integration testing
npm run dev:server  # Test in browser

# 5. Commit changes
npm run git:commit
```

### **Data Integration**
```bash
# 1. Update data schema
# Edit src/data/schema.*.json

# 2. Add data entries
# Edit src/data/models.[brand].json

# 3. Update TypeScript types
# Edit src/types/product.ts

# 4. Validate changes
npm run code:typecheck
```

---

## 🔄 Git Workflow

### **Branch Strategy**
- `main` - Production-ready code
- `feature/description` - New feature development
- `fix/description` - Bug fixes
- `refactor/description` - Code improvements

### **Commit Strategy**
```bash
# Use intelligent commit workflow
npm run git:commit

# This automatically:
# - Analyzes changes
# - Generates descriptive commit message
# - Follows project commit conventions
# - Includes AI co-authorship attribution
```

### **Pull Request Process**
1. **Create PR** with descriptive title and summary
2. **Link Issues** if addressing specific problems
3. **Request Review** from appropriate team members
4. **Address Feedback** with additional commits
5. **Merge** after approval and CI success

---

## 🔍 Debugging & Troubleshooting

### **Common Development Issues**

#### **TypeScript Errors**
```bash
# Check specific errors
npm run code:typecheck

# Review component standards
cat src/development-standards/standards/component-standards.md

# Get AI assistance
npm run rag:query -- "TypeScript error: [error-message]"
```

#### **Build Failures**
```bash
# Fast build without optimization
npm run dev:build:fast

# Check for import issues
npm run code:review -- --batch src/

# Verify file naming
npm run rag:query -- "file naming conventions"
```

#### **Styling Issues**
```bash
# Check SCSS compilation
npm run dev:server  # Watch for SCSS errors

# Review styling patterns
cat src/development-standards/standards/styling-patterns.md

# Validate component styles
npm run code:review -- --file [component-file]
```

### **Performance Issues**
```bash
# Build analysis
npm run dev:build  # Check build times and bundle size

# Development server performance
npm run dev:server:expose  # Test from different devices

# Component performance
npm run rag:query -- "performance optimization patterns"
```

---

## 📚 Advanced Topics

### **[Component Patterns](./component-patterns.md)**
Advanced component composition and reusability patterns

### **[API Guidelines](./api-guidelines.md)**
Backend integration and API endpoint development

### **[Testing Strategies](./testing.md)**
Comprehensive testing approaches and automation

### **[Performance Optimization](./performance.md)**
Build optimization and runtime performance tuning

### **[Troubleshooting Guide](./troubleshooting.md)**
Comprehensive problem-solving reference

---

## 🎓 Learning Resources

### **Project-Specific Learning**
```bash
# Interactive project exploration
npm run rag:query -- "How does the quiz component work?"
npm run rag:query -- "Product data architecture"
npm run rag:query -- "SEO implementation patterns"
```

### **Technology Learning**
- **Astro Documentation** - Framework-specific patterns
- **React Patterns** - Component development best practices
- **TypeScript Handbook** - Type system mastery
- **SCSS Guidelines** - Advanced styling techniques

### **Standards Reference**
- **[Functional Programming Guide](../../src/development-standards/functional-programming.md)**
- **[Component Standards](../../src/development-standards/standards/component-standards.md)**
- **[File Naming Conventions](../../src/development-standards/standards/file-naming.md)**

---

**Ready for productive development? Use the AI tools to accelerate your workflow and maintain high code quality.**

*Last updated: 2025-07-02*