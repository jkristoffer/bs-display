# 📱 Mobile VPS Management Setup Guide

Complete guide to manage your VPS from anywhere using GitHub Actions on your phone.

## 🔧 Initial Setup (One-time)

### Step 1: Set up DigitalOcean Secret

1. **Get your DigitalOcean API Token:**
   - Go to https://cloud.digitalocean.com/account/api/tokens
   - Click "Generate New Token"
   - Name: `GitHub-VPS-Management`
   - Scopes: `Read & Write`
   - Copy the token (save it securely!)

2. **Add Secret to GitHub:**
   - Go to your GitHub repository
   - Click `Settings` → `Secrets and variables` → `Actions`
   - Click `New repository secret`
   - Name: `DIGITALOCEAN_ACCESS_TOKEN`
   - Value: Paste your DigitalOcean token
   - Click `Add secret`

### Step 2: Test the Setup

1. Go to your repository on GitHub
2. Click `Actions` tab
3. Click `🚀 VPS Management` workflow
4. Click `Run workflow`
5. Select `status` action
6. Click `Run workflow`
7. Wait for completion - should show your current VPS resources

## 📱 Mobile Usage

### Quick Access URLs

**Bookmark these for instant mobile access:**

1. **Main Workflow:** 
   ```
   https://github.com/YOUR_USERNAME/bs-display/actions/workflows/vps-management.yml
   ```

2. **Direct Run:**
   ```
   https://github.com/YOUR_USERNAME/bs-display/actions/workflows/vps-management.yml?tab=workflow-runs
   ```

### Common Mobile Workflows

#### 🚀 Deploy New VPS
1. Open GitHub Actions on mobile
2. Select `🚀 VPS Management`
3. Click `Run workflow`
4. Settings:
   - Action: `deploy`
   - Session Name: `mobile-work` (or your choice)
   - Droplet Size: `s-2vcpu-4gb`
5. Click `Run workflow`
6. **Result:** VPS ready in ~3 minutes, connection details in job summary

#### 🔗 Get Connection Info
1. Run workflow with:
   - Action: `connect`
   - Session Name: `mobile-work`
2. **Result:** SSH command and development URLs

#### 📊 Check Status & Costs
1. Run workflow with:
   - Action: `status` (show all resources)
   - Action: `costs` (cost analysis)

#### 🧹 Cleanup Resources
1. Run workflow with:
   - Action: `cleanup`
2. **Result:** All droplets destroyed (saves money!)

## 📲 Mobile Apps Integration

### GitHub Mobile App
- **Download:** GitHub mobile app (iOS/Android)
- **Usage:** Full workflow access, notifications
- **Best for:** Quick status checks, running workflows

### SSH Mobile Apps
After deployment, use these apps to connect:

- **iOS:** Prompt 3, Termius
- **Android:** JuiceSSH, Termius
- **Connection:** Copy SSH command from workflow results

## 🎯 Practical Mobile Workflow

### Scenario: Working from Coffee Shop

1. **Deploy VPS** (30 seconds on mobile):
   ```
   GitHub Actions → VPS Management → Deploy → mobile-cafe
   ```

2. **Get SSH Details** (automated):
   - Check job summary or commit comment
   - Copy SSH command

3. **Connect via SSH app**:
   ```bash
   ssh dev@[IP_ADDRESS]
   ```

4. **Start Development**:
   ```bash
   cd /opt/bs-display/dev
   npm run dev:expose
   # Access: http://[IP_ADDRESS]:4321
   ```

5. **Cleanup when done**:
   ```
   GitHub Actions → VPS Management → Cleanup
   ```

## 💡 Pro Tips

### Workflow Results
- **Job Summary:** Quick mobile-friendly overview
- **Commit Comments:** SSH details posted as comments
- **Logs:** Detailed output for troubleshooting

### Cost Management
- **Monitor:** Use `costs` action regularly
- **Cleanup:** Always destroy droplets when done
- **Automation:** Set up cleanup reminders

### Mobile Optimization
- **Bookmarks:** Save direct workflow URLs
- **Notifications:** Enable GitHub mobile notifications
- **Shortcuts:** Create iOS shortcuts for common actions

## 📊 Cost Examples

**Typical Mobile Sessions:**
- **Quick check (30 min):** ~$0.02
- **Mobile work (2 hours):** ~$0.07
- **Extended session (4 hours):** ~$0.14
- **Full day (8 hours):** ~$0.29

**Monthly estimates if you use 1 hour daily:**
- **Daily usage:** ~$1/month
- **Snapshots:** ~$0.18/month
- **Total:** ~$1.20/month

## 🚨 Emergency Procedures

### Workflow Failed
1. Check logs in Actions tab
2. Verify secrets are set correctly
3. Run `status` action to check current state

### Can't Connect to VPS
1. Wait 2-3 minutes after deployment
2. Check VPS is running: `status` action
3. Verify SSH key is in DigitalOcean

### Forgot to Cleanup
1. Run `cleanup` action immediately
2. Or use DigitalOcean mobile app/website
3. Check `costs` action for current charges

## 🔄 Advanced Usage

### Custom Session Names
Use descriptive names for better organization:
- `feature-auth` - Working on authentication
- `mobile-cafe` - Mobile session from cafe
- `debug-prod` - Debugging production issues

### Multiple Sessions
Deploy multiple VPS instances for different purposes:
- Development environment
- Testing environment
- Backup environment

### Automated Cleanup
Set calendar reminders to run cleanup action to avoid unnecessary costs.

## 📞 Support

### GitHub Actions Issues
- Check workflow logs
- Verify repository secrets
- Review DigitalOcean token permissions

### VPS Connection Issues
- Use DigitalOcean dashboard as backup
- Verify SSH keys in DO account
- Check VPS firewall settings

### Cost Concerns
- Monitor usage with `costs` action
- Set DigitalOcean billing alerts
- Always cleanup unused resources

---

**🎯 Quick Reference:**
- Deploy: `Actions → VPS Management → deploy → [session-name]`
- Connect: Check job summary for SSH command
- Cleanup: `Actions → VPS Management → cleanup`
- Status: `Actions → VPS Management → status`

**📱 Bookmark:** Your repository Actions page for instant mobile access!