# GitHub Actions Test Plan - Enhanced Blog Workflow

## 🎯 Next Step: Test Enhanced Workflow

### **Step 1: Manual Workflow Trigger (Dry Run)**

**Go to GitHub Actions:**
1. Navigate to your repository on GitHub
2. Click **Actions** tab
3. Find **"Automated Blog Post Generation (Enhanced)"** workflow
4. Click **"Run workflow"** button

**Configure Test Run:**
```yaml
Branch: main (or your current branch)
force_generate: ✅ true
dry_run: ✅ true
rollback_pr: (leave empty)
```

**Expected Results:**
- ✅ Pre-flight validation passes
- ✅ Blog generation preview shown
- ✅ No actual files committed
- ✅ Detailed summary in workflow logs

---

## 🔍 Step 2: Verify Workflow Permissions

**Check Repository Settings:**
1. Go to **Settings** → **Actions** → **General**
2. Verify **Workflow permissions** are set to:
   - ✅ **Read and write permissions** 
   - ✅ **Allow GitHub Actions to create and approve pull requests**

**Required Permissions:**
- `contents: write` - For creating branches and commits
- `pull-requests: write` - For creating and managing PRs
- `issues: write` - For creating failure reports

---

## 📊 Step 3: Monitor Workflow Execution

**Watch for These Key Steps:**

### **✅ Pre-flight Validation**
- Content queue exists and has posts
- Blog generation script exists
- Content directory exists
- Posts available count

### **✅ Blog Generation Process**
- Content queue backed up
- Dry run mode activated
- Generation result captured
- Success/failure detected

### **✅ Validation Results**
- Generated content validated
- File size checks
- Frontmatter validation
- Content quality checks

### **✅ Dry Run Summary**
- What would happen summary
- Recommendations for next steps
- No actual changes made

---

## 🚨 Troubleshooting Common Issues

### **Permission Errors**
```bash
Error: Resource not accessible by integration
```
**Fix**: Check workflow permissions in repository settings

### **Path Errors**
```bash
Error: ENOENT: no such file or directory
```
**Fix**: Verify all file paths are correct in workflow

### **Node/NPM Errors**
```bash
Error: Cannot find module
```
**Fix**: Check if `npm ci` completed successfully

### **Content Queue Errors**
```bash
Error: No posts available
```
**Fix**: Verify content-queue.json has posts array

---

## 🔧 Step 4: Test Live Generation (If Dry Run Succeeds)

**Only proceed if dry run is successful:**

1. **Run workflow again** with:
   ```yaml
   force_generate: ✅ true
   dry_run: ❌ false
   ```

2. **Expected Results:**
   - ✅ Feature branch created
   - ✅ Blog post committed
   - ✅ PR created with review template
   - ✅ SEO analysis triggered
   - ✅ Rollback instructions included

---

## 🔄 Step 5: Test Rollback Feature

**If PR is created in Step 4:**

1. **Get PR Number** from workflow logs or PR list
2. **Run workflow** with:
   ```yaml
   rollback_pr: [PR_NUMBER]
   ```

3. **Expected Results:**
   - ✅ PR closed automatically
   - ✅ Feature branch deleted
   - ✅ Rollback comment added
   - ✅ Clean state restored

---

## 📋 Success Criteria Checklist

### **Dry Run Test:**
- [ ] Workflow triggers successfully
- [ ] Pre-flight validation passes
- [ ] Blog generation preview works
- [ ] No files are actually modified
- [ ] Detailed summary provided

### **Live Generation Test:**
- [ ] Feature branch created
- [ ] Blog post file generated
- [ ] PR created with proper template
- [ ] SEO analysis triggers
- [ ] Content quality meets standards

### **Rollback Test:**
- [ ] PR closes automatically
- [ ] Feature branch deleted
- [ ] Rollback comment added
- [ ] Repository state clean

### **Error Handling:**
- [ ] Failed runs create GitHub issues
- [ ] Backup restoration works
- [ ] Detailed error logs provided
- [ ] System recovers gracefully

---

## 🎯 Expected Workflow Output

### **Dry Run Success:**
```
## 🔍 Dry Run Summary
**Mode**: Dry run (no changes committed)
**Validation**: true
**Generation**: true
**Generated File**: smart-board-setup-guide-2025.md

### What Would Happen:
1. ✅ Content would be generated successfully
2. ✅ Feature branch would be created
3. ✅ Pull request would be created for review
4. ✅ Rollback option would be available

**Recommendation**: Run without dry-run to proceed with actual generation
```

### **Live Generation Success:**
```
## 📊 Workflow Summary
- **Date**: 2025-07-04
- **Trigger**: workflow_dispatch
- **Mode**: Live Run
- **Generation Success**: true
- **Generated File**: smart-board-setup-guide-2025.md
- **Branch Created**: automated-blog-post-20250704-123456
- **PR Number**: 123
- **PR URL**: https://github.com/[repo]/pull/123

✅ Blog post successfully generated and PR created for review.
🔄 Rollback available via workflow dispatch using PR #123
```

---

## 🚀 Ready to Execute

**Current Status:**
- ✅ Enhanced workflow deployed
- ✅ Content queue populated (3 posts)
- ✅ SEO workflow paths fixed
- ✅ Local testing completed
- ✅ Old workflow disabled

**Next Action:** Navigate to GitHub Actions and run the enhanced workflow with dry-run mode enabled.

**Note**: The workflow will process the first post in the queue: "How to Set Up Smart Boards for Maximum Classroom Engagement" (how-to template, 12 min read).

---

*After completing the dry run test, proceed with live generation testing, then rollback testing to validate the complete workflow.*