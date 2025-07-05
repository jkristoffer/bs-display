# Blog Workflow Management Guide

## 🚨 Debug Summary

### Primary Issues Found
1. **Empty Content Queue**: `content-queue.json` has no scheduled posts
2. **Path Issues**: SEO workflow has incorrect `dev/` paths
3. **Missing Error Handling**: Original workflow lacks rollback capabilities

### Fixed Issues
✅ Added comprehensive error handling and validation  
✅ Implemented automatic rollback strategy  
✅ Added dry-run mode for safe testing  
✅ Enhanced logging and debugging  
✅ Added content validation  

---

## 🔧 Enhanced Workflow Features

### New Workflow: `automated-blog-generation-v2.yml`

**Key Improvements:**
- **Rollback Strategy**: Automatic PR closure and branch deletion
- **Dry Run Mode**: Test without making changes
- **Pre-flight Validation**: Checks files and queue before running
- **Content Validation**: Validates generated content quality
- **Auto Recovery**: Restores backups on failure
- **Enhanced Logging**: Detailed step-by-step progress

---

## 🎮 Usage Guide

### 1. Normal Operation
```bash
# Automatic: Runs every 3 days at 9:00 AM UTC
# Manual trigger via GitHub Actions web interface
```

### 2. Dry Run Testing
```bash
# GitHub Actions → Run workflow → Enable "dry_run"
# Or manually:
npm run content:blog:generate -- --dry-run
```

### 3. Force Generation
```bash
# GitHub Actions → Run workflow → Enable "force_generate"
# Generates content even if queue is empty
```

### 4. Rollback a PR
```bash
# GitHub Actions → Run workflow → Enter PR number in "rollback_pr"
# Automatically closes PR and deletes branch
```

---

## 📋 Quick Fixes

### Fix Empty Content Queue
Add sample content to `content-queue.json`:
```json
{
  "scheduledPosts": [
    {
      "id": "sample-post-1",
      "title": "Interactive Display Technology Comparison",
      "template": "comparison",
      "scheduledDate": "2025-07-07",
      "data": {
        "techA": "LED Technology",
        "techB": "LCD Technology",
        "mainTopic": "Interactive Display Technologies"
      }
    }
  ]
}
```

### Fix SEO Workflow Paths
In `.github/workflows/seo-review-trigger.yml`:
```yaml
# Change from:
- 'dev/src/content/blog/**/*.md'
# To:
- 'src/content/blog/**/*.md'
```

### Manual Blog Generation
```bash
# Test locally first
npm run content:blog:generate -- --dry-run

# Generate if queue has content
npm run content:blog:generate
```

---

## 🔄 Rollback Procedures

### Automatic Rollback (Recommended)
1. Go to **Actions** → **Automated Blog Post Generation (Enhanced)**
2. Click **Run workflow**
3. Enter the PR number in **rollback_pr** field
4. Click **Run workflow**

**What happens:**
- PR is closed automatically
- Feature branch is deleted
- Rollback comment is added to PR
- No manual cleanup needed

### Manual Rollback
```bash
# Close PR via GitHub web interface, then:
git push origin --delete [branch-name]
```

---

## 📊 Monitoring & Debugging

### Check Workflow Status
1. **GitHub Actions** tab shows all runs
2. **Issues** tab shows automatic failure reports
3. **Pull Requests** show generated content awaiting review

### Debug Failed Runs
1. Check the **Actions** tab for detailed logs
2. Look for **Step Summary** in failed runs
3. Check **Issues** for automatic failure reports
4. Use **dry-run** mode to test fixes

### Common Error Patterns
- **Empty Queue**: Add content to `content-queue.json`
- **Path Errors**: Fix file paths in workflow YAML
- **Permission Issues**: Check GitHub Actions permissions
- **Script Errors**: Test `npm run content:blog:generate` locally

---

## 🛡️ Safety Features

### Built-in Protections
- **Pre-flight Validation**: Checks prerequisites before running
- **Content Validation**: Validates generated content quality
- **Automatic Backups**: Backs up content queue before changes
- **Auto Recovery**: Restores state if generation fails
- **Dry Run Mode**: Test without making changes

### Rollback Capabilities
- **Instant Rollback**: Close PR and delete branch in one action
- **No Data Loss**: Original content queue is preserved
- **Clean State**: No orphaned branches or PRs
- **Audit Trail**: Rollback actions are logged and commented

---

## 🔧 Configuration

### Enable Enhanced Workflow
1. **Disable old workflow**: Rename `automated-blog-generation.yml` to `automated-blog-generation.yml.disabled`
2. **Enable new workflow**: The new `automated-blog-generation-v2.yml` is ready to use
3. **Test first**: Run with dry-run mode to verify functionality

### Workflow Permissions
Ensure GitHub Actions has these permissions:
- **Contents**: write (for creating branches and commits)
- **Pull Requests**: write (for creating and managing PRs)
- **Issues**: write (for creating failure reports)

---

## 📈 Next Steps

### Immediate Actions
1. **Fix Content Queue**: Add sample posts to enable generation
2. **Fix SEO Workflow**: Update paths to remove `dev/` prefix
3. **Test Enhanced Workflow**: Run with dry-run mode
4. **Disable Old Workflow**: Rename to avoid conflicts

### Long-term Improvements
1. **Content Pipeline**: Develop system for populating content queue
2. **Quality Metrics**: Add automated content quality scoring
3. **A/B Testing**: Test different content templates and styles
4. **Integration**: Connect with CMS or content management system

---

## 🆘 Emergency Procedures

### Workflow Stuck or Failing
1. **Cancel Running Workflow**: Go to Actions → Cancel run
2. **Use Rollback**: If PR was created, use rollback procedure
3. **Check Logs**: Review failure logs for root cause
4. **Test Locally**: Use `npm run content:blog:generate -- --dry-run`

### Mass Rollback (Multiple PRs)
```bash
# Use the rollback feature for each PR individually
# Or manually close PRs and delete branches:
git branch -r | grep automated-blog-post | xargs -I {} git push origin --delete {}
```

### System Recovery
1. **Restore Content Queue**: From backup if corrupted
2. **Clean Branches**: Remove any orphaned automated branches
3. **Reset Workflow**: Disable and re-enable if needed
4. **Test Pipeline**: Run full dry-run test to verify functionality

---

*This guide covers the enhanced blog generation workflow with comprehensive error handling, rollback capabilities, and safety features. Always test with dry-run mode before making live changes.*