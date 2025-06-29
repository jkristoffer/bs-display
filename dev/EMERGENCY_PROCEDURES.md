# Emergency Procedures & System Recovery

**Purpose**: Critical recovery procedures for automation systems and development infrastructure.  
**Context**: Single-developer AI-first development environment  
**Last Updated**: June 29, 2025

## 🚨 Quick Emergency Response

### System Down Checklist
1. **Check automation status**: All scripts in `/scripts/` directory
2. **Verify GitHub Actions**: Check `.github/workflows/` for failing workflows  
3. **Test core commands**: `npm run dev`, `npm run build`, `npm run check`
4. **Review recent changes**: `git log --oneline -10` for recent commits

### Emergency Contacts & Resources
- **GitHub Actions Status**: https://www.githubstatus.com/
- **Vercel Status**: https://status.vercel.com/
- **Node.js Documentation**: https://nodejs.org/docs/
- **Astro Troubleshooting**: https://docs.astro.build/en/guides/troubleshooting/

---

## 🤖 Automation System Failures

### Code Review Agent Issues

#### **Symptoms**
- Code review agent fails to run: `node scripts/code-review-agent.js --file [file]`
- GitHub Actions code review workflow failing
- Score calculation errors or crashes

#### **Immediate Response**
```bash
# 1. Test basic functionality
node scripts/code-review-agent.js --file src/components/common/Button/Button.astro

# 2. Check dependencies
npm list typescript @typescript-eslint/parser

# 3. Verify file permissions
ls -la scripts/code-review-agent.js

# 4. Check for syntax errors
node -c scripts/code-review-agent.js
```

#### **Recovery Steps**
1. **Script corruption**: Restore from git history
   ```bash
   git checkout HEAD~1 -- scripts/code-review-agent.js
   ```

2. **Dependency issues**: Reinstall packages
   ```bash
   npm install
   npm audit fix
   ```

3. **GitHub Actions failure**: Check workflow file
   - Verify `.github/workflows/code-review-automation.yml`
   - Check GitHub Actions logs for specific errors
   - Restart failed workflow runs

#### **Testing Recovery**
```bash
# Verify agent works with a simple file
echo 'const test = "hello";' > test-file.js
node scripts/code-review-agent.js --file test-file.js
rm test-file.js
```

### SEO System Failures

#### **Symptoms**
- SEO analysis fails: `node scripts/seo-agent.js`
- Auto-optimization crashes: `node scripts/seo-optimizer.js`
- Blog content analysis errors

#### **Immediate Response**
```bash
# 1. Test SEO agent
node scripts/seo-agent.js --file src/content/blog/smart-board-comparison-chart.md

# 2. Check file accessibility
ls -la scripts/seo-*.js

# 3. Verify markdown files exist
find src/content/blog -name "*.md" | head -5
```

#### **Recovery Steps**
1. **Script corruption**: Restore SEO scripts
   ```bash
   git checkout HEAD~1 -- scripts/seo-agent.js scripts/seo-optimizer.js
   ```

2. **Content file issues**: Verify blog post format
   ```bash
   # Check frontmatter format
   head -20 src/content/blog/[failing-post].md
   ```

3. **Safety system failures**: Reset optimization backups
   ```bash
   # Clear corrupted backups if needed
   find . -name "*.backup.*" -type f
   ```

#### **Testing Recovery**
```bash
# Test with a known good blog post
node scripts/seo-agent.js --file src/content/blog/smart-board-comparison-chart.md --format console
```

### Blog Generation Problems

#### **Symptoms**
- Blog generation fails: `node scripts/generate-blog-post.js`
- Content queue corruption
- GitHub Actions blog workflow failures

#### **Immediate Response**
```bash
# 1. Check content queue
cat content-queue.json | jq .

# 2. Verify blog generation script
node -c scripts/generate-blog-post.js

# 3. Test content directory access
ls -la src/content/blog/
```

#### **Recovery Steps**
1. **Content queue corruption**: Restore queue database
   ```bash
   git checkout HEAD~1 -- content-queue.json
   ```

2. **Template issues**: Verify content templates exist
   ```bash
   # Check for template references in script
   grep -n "template" scripts/generate-blog-post.js
   ```

3. **File permission issues**: Fix content directory permissions
   ```bash
   chmod -R 755 src/content/
   ```

#### **Testing Recovery**
```bash
# Test blog generation in dry-run mode
node scripts/generate-blog-post.js --dry-run
```

### GitHub Workflow Failures

#### **Symptoms**
- Automated workflows failing in GitHub Actions
- PR analysis not running
- Scheduled blog generation stopped

#### **Immediate Response**
1. **Check GitHub Actions tab** in repository
2. **Review workflow logs** for specific error messages
3. **Verify workflow files** in `.github/workflows/`

#### **Common Issues & Fixes**

**Authentication Problems**:
```yaml
# Check if GitHub token is properly configured
# Workflows should use: ${{ secrets.GITHUB_TOKEN }}
```

**Node.js Version Issues**:
```yaml
# Verify Node.js version in workflows
- uses: actions/setup-node@v3
  with:
    node-version: '18'
```

**Script Path Problems**:
```yaml
# Ensure script paths are correct in workflows
- run: node scripts/code-review-agent.js
```

#### **Recovery Steps**
1. **Re-run failed workflows** from GitHub Actions interface
2. **Update workflow files** if syntax errors found
3. **Check repository permissions** for GitHub Actions

---

## 💾 Backup and Recovery

### Critical Files Backup

#### **Essential Files to Backup**
```bash
# Core automation scripts
cp -r scripts/ ../backup-scripts-$(date +%Y%m%d)/

# Configuration files
cp content-queue.json ../backup-config-$(date +%Y%m%d)/
cp package.json ../backup-config-$(date +%Y%m%d)/
cp tsconfig.json ../backup-config-$(date +%Y%m%d)/

# Documentation
cp CLAUDE.md ../backup-docs-$(date +%Y%m%d)/
cp -r src/development-standards/ ../backup-standards-$(date +%Y%m%d)/
```

#### **Automated Backup Script**
Create a backup script for regular use:
```bash
#!/bin/bash
# create-backup.sh
BACKUP_DIR="../bs-display-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Copy critical files
cp -r scripts/ "$BACKUP_DIR/"
cp -r .github/workflows/ "$BACKUP_DIR/"
cp content-queue.json "$BACKUP_DIR/"
cp CLAUDE.md "$BACKUP_DIR/"
cp package.json "$BACKUP_DIR/"

echo "Backup created: $BACKUP_DIR"
```

### Configuration Restoration

#### **Restore Automation Scripts**
```bash
# If all scripts are corrupted, restore from backup
cp -r ../backup-scripts-[DATE]/scripts/ ./

# Or restore from git history
git checkout HEAD~[N] -- scripts/

# Verify restoration
npm run build
npm run check
```

#### **Restore Content Queue**
```bash
# Restore content queue from backup
cp ../backup-config-[DATE]/content-queue.json ./

# Or restore from git
git checkout HEAD~[N] -- content-queue.json

# Validate JSON format
cat content-queue.json | jq .
```

### Data Recovery Steps

#### **Lost Development Work**
1. **Check git stash**: `git stash list`
2. **Review reflog**: `git reflog --all`
3. **Restore from commits**: `git checkout [commit-hash] -- [file]`

#### **Corrupted Dependencies**
```bash
# Nuclear option: clean reinstall
rm -rf node_modules/
rm package-lock.json
npm install
```

#### **Lost Configuration**
```bash
# Restore all configuration files
git checkout HEAD -- package.json tsconfig.json astro.config.mjs
npm install
```

---

## 🔧 Quick Diagnostics

### System Health Checks

#### **Core Functionality Test**
```bash
# 1. Test development environment
npm run dev &
PID=$!
sleep 5
curl -I http://localhost:4321
kill $PID

# 2. Test build process
npm run build
npm run preview &
PID=$!
sleep 5
curl -I http://localhost:4322
kill $PID

# 3. Test type checking
npm run check
```

#### **Automation Systems Test**
```bash
# Test each automation script individually
echo "Testing Code Review Agent..."
node scripts/code-review-agent.js --file CLAUDE.md --format json > /dev/null

echo "Testing SEO Agent..."
node scripts/seo-agent.js --file src/content/blog/smart-board-comparison-chart.md --format console > /dev/null

echo "Testing Blog Generator..."
node -c scripts/generate-blog-post.js

echo "All automation scripts accessible ✓"
```

### Common Error Patterns

#### **Node.js / NPM Issues**
```bash
# Symptom: "command not found" errors
which node npm
node --version
npm --version

# Symptom: Permission errors
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### **TypeScript Compilation Errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit --listFiles | head -20

# Verify path mappings
grep -A 10 "paths" tsconfig.json
```

#### **Import/Export Errors**
```bash
# Check for circular dependencies
npm list --depth=0

# Verify file extensions and imports
find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -l "import.*from.*[^.]$"
```

### Performance Issues

#### **Slow Build Times**
```bash
# Profile build performance
time npm run build

# Check for large dependencies
npm list --depth=0 --long

# Clear caches
rm -rf .astro/
rm -rf dist/
npm run build
```

#### **Memory Issues**
```bash
# Monitor memory usage during operations
top -l 1 | grep node

# Increase Node.js memory limit if needed
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## 📞 External Resources

### Documentation Links
- **Astro Troubleshooting**: https://docs.astro.build/en/guides/troubleshooting/
- **GitHub Actions Docs**: https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Node.js Debugging**: https://nodejs.org/en/docs/guides/debugging-getting-started/

### Community Support
- **Astro Discord**: https://astro.build/chat
- **GitHub Community**: https://github.com/community
- **Stack Overflow**: Search with tags: `astro`, `typescript`, `github-actions`

### Emergency Tools
- **GitHub CLI**: `gh auth status`, `gh workflow list`
- **JSON Validator**: https://jsonlint.com/
- **Markdown Validator**: https://www.markdownguide.org/tools/

### Monitoring & Status Pages
- **GitHub Status**: https://www.githubstatus.com/
- **NPM Status**: https://status.npmjs.org/
- **Vercel Status**: https://status.vercel.com/

---

## 📝 Recovery Log Template

When performing emergency recovery, document the incident:

```markdown
## Incident Report: [DATE]

### Issue Description
[Brief description of what went wrong]

### Systems Affected
- [ ] Code Review Agent
- [ ] SEO Analysis System  
- [ ] Blog Generation
- [ ] GitHub Workflows
- [ ] Development Environment

### Root Cause
[What caused the issue]

### Recovery Actions Taken
1. [Action 1]
2. [Action 2]
3. [Action 3]

### Verification Steps
- [ ] All automation scripts functional
- [ ] Development environment working
- [ ] GitHub workflows passing
- [ ] Content generation operational

### Prevention Measures
[What can be done to prevent this in the future]

### Time to Resolution
[How long it took to fix]
```

---

**Remember**: The goal is to get systems operational quickly while maintaining data integrity. When in doubt, restore from git history rather than attempting complex manual fixes.