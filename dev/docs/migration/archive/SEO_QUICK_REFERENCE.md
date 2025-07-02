# 🚀 SEO System Quick Reference

## 🎯 **Most Used Commands**

```bash
# Quick SEO check
claude seo-quick-check --file blog.md

# Auto-optimize (recommended)
claude seo-auto-optimize --file blog.md

# Full PR optimization
claude seo-auto-optimize --pr 123

# Performance report
claude seo-report
```

## 📊 **SEO Score Guide**

| Score | Grade | Action |
|-------|-------|---------|
| 90-100 | A ⭐⭐⭐⭐⭐ | Perfect! |
| 80-89 | B ⭐⭐⭐⭐ | Ready to publish |
| 70-79 | C ⭐⭐⭐ | Minor fixes needed |
| 50-69 | D ⭐⭐ | Needs work |
| 0-49 | F ❌ | Major fixes required |

## 🔧 **Optimization Checklist**

✅ **Title**: 50-60 chars, keywords early, power words, year  
✅ **Description**: 150-160 chars, keywords, CTA  
✅ **Keywords**: 5-7 relevant terms, industry-specific  
✅ **Structure**: Intro, headings, conclusion, FAQ  
✅ **Content**: 1500+ words, expertise, examples  

## ⚡ **Quick Workflow**

1. **Check Score**: `claude seo-quick-check --file blog.md`
2. **Optimize**: `claude seo-auto-optimize --file blog.md`  
3. **Verify**: `claude seo-quick-check --file blog.md`
4. **Commit**: `git add . && git commit -m "seo: optimize blog post"`

## 🚨 **Common Issues**

**"File modified recently"** → Wait 30 seconds  
**"No blog content found"** → Check file path/extension  
**"GitHub auth required"** → Run `gh auth login`  
**"Score decreased"** → Auto-rollback performed ✅

## 📚 **Full Documentation**

- **BLOG_AUTOMATION_README.md** - Complete guide
- **CLAUDE.md** - System architecture  
- **claude help** - Command reference