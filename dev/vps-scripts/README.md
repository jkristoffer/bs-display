# BS-Display VPS Development Scripts

Quick deployment scripts for spinning up DigitalOcean development environments with your bs-display project pre-configured.

## 🚀 Quick Start

1. **One-time setup** (creates base snapshot):
   ```bash
   chmod +x *.sh
   ./manage.sh create-base
   ```

2. **Daily use** (< 3 minutes to ready environment):
   ```bash
   ./manage.sh deploy my-session
   ```

3. **Connect from iPhone with Prompt 3**:
   ```bash
   ./manage.sh connect my-session
   # Shows: ssh dev@[IP_ADDRESS]
   ```

4. **Clean up when done**:
   ```bash
   ./manage.sh cleanup
   ```

## 📋 Prerequisites

- **doctl** installed and authenticated:
  ```bash
  brew install doctl
  doctl auth init
  ```

- **SSH key** added to DigitalOcean (auto-detected)

- **Git repository** accessible (currently points to kristoffersanio/bs-display)

## 📁 Scripts Overview

### `manage.sh` - **Main Control Script** 🎯
Your go-to script for all VPS operations:
```bash
# Quick operations
./manage.sh deploy my-session    # Create new environment
./manage.sh connect my-session   # Get SSH details  
./manage.sh status               # Show current resources
./manage.sh cleanup              # Clean up resources
./manage.sh costs                # Cost analysis

# Advanced operations
./manage.sh create-base          # Create base snapshot
./manage.sh update              # Update base snapshot
./manage.sh test                # Run system tests
```

### `cleanup.sh` - **Resource Management** 🧹
Comprehensive cleanup with multiple options:
```bash
# Interactive cleanup (recommended)
./cleanup.sh

# Quick commands  
./cleanup.sh list                # List all resources
./cleanup.sh droplets            # Delete all droplets
./cleanup.sh snapshots 5         # Keep latest 5 snapshots
./cleanup.sh all                 # Clean droplets + old snapshots
./cleanup.sh emergency --force   # Nuclear option (delete everything)
```

### `create-base-snapshot.sh`
Creates a base DigitalOcean snapshot with all dependencies pre-installed:
- Ubuntu 24.04 LTS
- Node.js 20
- npm with optimized configuration
- Claude Code CLI
- Git, tmux, mosh
- Your bs-display project with dependencies installed

**Usage:**
```bash
./create-base-snapshot.sh
```

**Time:** ~8-10 minutes (one-time setup)

### `spin-up.sh`
Quickly deploys a development environment from the base snapshot:
- Creates droplet from snapshot
- Pulls latest code
- Updates dependencies
- Ready for development

**Usage:**
```bash
# Default name
./spin-up.sh

# Custom name
./spin-up.sh my-feature-branch

# Custom region/size
DO_REGION=sfo3 DO_SIZE=s-4vcpu-8gb ./spin-up.sh
```

**Time:** ~2-3 minutes

### `update-snapshot.sh`
Updates the base snapshot with latest code and dependencies:
- Creates temporary droplet from current snapshot
- Updates system packages
- Pulls latest code
- Updates npm dependencies
- Creates new snapshot

**Usage:**
```bash
./update-snapshot.sh
```

**Recommended:** Run weekly or when dependencies change

## 🎯 Development Workflow

### Starting a Session
```bash
# 1. Create development environment
./manage.sh deploy feature-work

# 2. Get connection details
./manage.sh connect feature-work

# 3. SSH into environment (from terminal or Prompt 3)
ssh dev@[IP_ADDRESS]

# 4. Start development server
./start-dev.sh
# or
npm run dev -- --host 0.0.0.0

# 5. Access in browser: http://[IP_ADDRESS]:4321
```

### Working in the Environment
```bash
# Project is at /opt/bs-display/dev
cd /opt/bs-display/dev

# Convenient aliases available:
dev     # Start dev server
build   # Build project
check   # Run Astro check

# Update to latest code:
./update-project.sh
```

### Ending a Session (Important! 💰)
```bash
# Option 1: Interactive cleanup (recommended)
./manage.sh cleanup

# Option 2: Quick cleanup
./cleanup.sh droplets

# Option 3: Specific droplet
./manage.sh status    # Get droplet names
./cleanup.sh          # Interactive mode to select specific droplets

# Option 4: Emergency - delete everything
./cleanup.sh emergency
```

## 💰 Cost Management

### Droplet Costs (hourly billing)
- **s-2vcpu-4gb**: $24/month → ~$0.036/hour
- **Development session (4 hours)**: ~$0.14
- **Full day (8 hours)**: ~$0.29

### Snapshot Storage
- **Base snapshot**: ~2-3GB → $0.12-0.18/month
- **3 snapshots total**: ~$0.50/month

### Cost-Saving Tips
1. **Destroy droplets** when not actively developing
2. **Use smaller sizes** for simple tasks (`s-1vcpu-2gb`)
3. **Batch development** sessions to minimize spin-up overhead

## 🔧 Configuration

### Environment Variables
```bash
# Default region (override with DO_REGION)
DO_REGION=nyc3  # or sfo3, ams3, sgp1, etc.

# Default droplet size (override with DO_SIZE)
DO_SIZE=s-2vcpu-4gb  # or s-1vcpu-2gb, s-4vcpu-8gb, etc.
```

### GitHub Repository
Update the repository URL in `provision-base.sh`:
```bash
git clone https://github.com/YOUR_USERNAME/bs-display.git .
```

## 🛠️ Troubleshooting

### Common Issues

**"No snapshots found"**
```bash
# Run the base setup first
./create-base-snapshot.sh
```

**"SSH connection failed"**
```bash
# Wait a moment for droplet to finish booting
# Check droplet status:
doctl compute droplet list
```

**"Git clone failed"**
```bash
# Check if repository is public or add SSH key
# Update repository URL in provision-base.sh
```

**"npm install failed"**
```bash
# SSH into droplet and check logs:
ssh dev@[IP] 'tail -f /var/log/provision.log'
```

### Log Files
- **Provisioning logs**: `/var/log/provision.log`
- **User-data logs**: `/var/log/cloud-init-output.log`
- **Session info**: `.last-session` (local file)

### Manual Recovery
```bash
# If something goes wrong, you can always SSH as root:
ssh root@[IP_ADDRESS]

# Check what's running:
ps aux | grep node

# Check logs:
journalctl -u astro-dev

# Restart services:
systemctl restart astro-dev
```

## 🔄 Maintenance

### Weekly Tasks
```bash
# Update base snapshot with latest code/dependencies
./update-snapshot.sh
```

### Monthly Tasks
```bash
# Recreate base snapshot with system updates
./create-base-snapshot.sh
```

### Cleanup
```bash
# List all bs-display droplets
doctl compute droplet list --tag-name bs-display

# Delete old droplets
doctl compute droplet delete [DROPLET_NAME] --force

# List snapshots
doctl compute snapshot list | grep bs-display
```

## 📱 Mobile Development Tips

### Using Prompt 3
1. Save connection as a host in Prompt 3
2. Use mosh for better mobile connectivity:
   ```bash
   mosh dev@[IP_ADDRESS]
   ```
3. Use tmux for persistent sessions:
   ```bash
   tmux new -s dev
   # Later: tmux attach -s dev
   ```

### Port Forwarding
```bash
# Forward local port to development server
ssh -L 4321:localhost:4321 dev@[IP_ADDRESS]
# Then access http://localhost:4321 on your phone
```

## 🎉 Success!

After running these scripts, you'll have:
- ✅ A pre-configured development environment
- ✅ Latest bs-display code ready to run
- ✅ Claude Code CLI available
- ✅ All dependencies installed
- ✅ Development server ready to start
- ✅ SSH access from any device

**Total time from zero to coding: < 3 minutes** ⚡