# Quick Troubleshooting

## Emergency Response

### System Down Checklist
1. **Check automation status**: All scripts in `/scripts/` directory
2. **Verify GitHub Actions**: Check `.github/workflows/` for failing workflows  
3. **Test core commands**: `npm run dev:server`, `npm run dev:build`, `npm run code:typecheck`
4. **Review recent changes**: `git log --oneline -10` for recent commits

### Emergency Resources
- **GitHub Actions Status**: https://www.githubstatus.com/
- **Vercel Status**: https://status.vercel.com/
- **Node.js Documentation**: https://nodejs.org/docs/
- **Astro Troubleshooting**: https://docs.astro.build/en/guides/troubleshooting/

## Common Issues

### Code Review Agent Issues

**Quick Test:**
```bash
# Test basic functionality
node scripts/code-review-agent.js --file src/components/common/Button/Button.astro

# Check dependencies
npm list typescript @typescript-eslint/parser

# Verify file permissions
ls -la scripts/code-review-agent.js
```

**Recovery:**
```bash
# Restore from git history
git checkout HEAD~1 -- scripts/code-review-agent.js

# Reinstall packages
npm install
npm audit fix
```

### TypeScript Errors
1. Run `npm run code:typecheck` to see specific errors
2. Check `/src/development-standards/standards/component-standards.md` for patterns
3. Verify imports match file naming conventions

### Build Failures
1. Check console output for specific errors
2. Run `npm run dev:build:fast` to skip image optimization
3. Verify all imports use correct paths and extensions

### Context Problems
1. Use Glob tool to find files: `*.tsx`, `**/*.astro`
2. Use LS tool to explore directory structure
3. Reference full Emergency Procedures documentation

## Path Issues
- **Development Standards**: `/src/development-standards/standards/`
- **Components**: `/src/components/`
- **Product Data**: `/src/data/models.[brand].json`
- **Automation Scripts**: `/scripts/`
