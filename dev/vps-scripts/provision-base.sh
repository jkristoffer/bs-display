#!/bin/bash
# provision-base.sh - Provisions the base image with all dependencies

set -e

# Log everything for debugging
exec > >(tee -a /var/log/provision.log)
exec 2>&1

echo "=== Starting BS-Display Base Provisioning at $(date) ==="

# Environment setup
export DEBIAN_FRONTEND=noninteractive
export NODE_VERSION=20
export NPM_CONFIG_LOGLEVEL=error
export NPM_CONFIG_PROGRESS=false
export NPM_CONFIG_FUND=false
export NPM_CONFIG_AUDIT=false

# Function to run tasks in parallel
run_parallel() {
    local pids=()
    for cmd in "$@"; do
        echo "Starting: $cmd"
        eval "$cmd" &
        pids+=($!)
    done
    for pid in "${pids[@]}"; do
        wait "$pid"
    done
}

# Update system packages first
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install essential packages
echo "Installing essential packages..."
apt-get install -y \
    git \
    curl \
    build-essential \
    tmux \
    mosh \
    unzip \
    ca-certificates \
    gnupg \
    software-properties-common

# Parallel installation tasks
echo "Starting parallel installation tasks..."

# Task 1: Install Node.js
task_nodejs() {
    echo "Installing Node.js ${NODE_VERSION}..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
    
    # Optimize npm configuration
    npm config set registry https://registry.npmjs.org/
    npm config set prefer-offline true
    npm config set cache-min 9999999
    npm install -g npm@latest
    echo "Node.js installation complete"
}

# Task 2: Install Claude Code
task_claude() {
    echo "Installing Claude Code..."
    npm install -g @anthropic/claude-code
    echo "Claude Code installation complete"
}

# Task 3: Setup development user
task_user_setup() {
    echo "Setting up development user..."
    useradd -m -s /bin/bash dev
    echo "dev ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
    
    # Setup SSH directory
    mkdir -p /home/dev/.ssh
    chmod 700 /home/dev/.ssh
    chown dev:dev /home/dev/.ssh
    
    # Copy root's authorized_keys to dev user
    if [ -f /root/.ssh/authorized_keys ]; then
        cp /root/.ssh/authorized_keys /home/dev/.ssh/
        chown dev:dev /home/dev/.ssh/authorized_keys
        chmod 600 /home/dev/.ssh/authorized_keys
    fi
    
    echo "Development user setup complete"
}

# Task 4: Configure firewall
task_firewall() {
    echo "Configuring firewall..."
    ufw allow 22/tcp
    ufw allow 4321/tcp  # Astro dev server
    ufw allow 60000:61000/udp  # Mosh
    ufw --force enable
    echo "Firewall configuration complete"
}

# Run parallel tasks
run_parallel "task_nodejs" "task_claude" "task_user_setup" "task_firewall"

# Setup project directory structure
echo "Setting up project directory..."
mkdir -p /opt/bs-display
chown dev:dev /opt/bs-display

# Switch to dev user for project setup
sudo -u dev bash << 'DEVEOF'
cd /opt/bs-display

# Clone the repository
echo "Cloning bs-display repository..."
git clone https://github.com/jkristoffer/bs-display.git .

# Change to dev directory
cd dev

# Install project dependencies
echo "Installing project dependencies..."
npm ci --prefer-offline

# Pre-build to warm caches
echo "Pre-building project..."
npm run build || echo "Pre-build failed, continuing..."

# Setup development environment
echo "Setting up development environment..."

# Create convenient aliases and setup
cat >> ~/.bashrc << 'EOF'
# BS-Display development aliases
alias ll='ls -la'
alias dev='cd /opt/bs-display/dev && npm run dev -- --host 0.0.0.0'
alias build='cd /opt/bs-display/dev && npm run build'
alias check='cd /opt/bs-display/dev && npm run check'

# Environment variables
export PATH="/usr/local/bin:$PATH"
export NODE_ENV=development

# Auto-start in project directory
cd /opt/bs-display/dev

# Welcome message
echo "✅ BS-Display development environment ready!"
echo "📁 Project: /opt/bs-display/dev"
echo "🚀 Start dev server: dev"
echo "🔧 Build project: build"
echo "🤖 Claude CLI: claude --help"
EOF

# Create start script
cat > ~/start-dev.sh << 'EOF'
#!/bin/bash
cd /opt/bs-display/dev
echo "Starting Astro development server..."
npm run dev -- --host 0.0.0.0
EOF
chmod +x ~/start-dev.sh

# Create update script
cat > ~/update-project.sh << 'EOF'
#!/bin/bash
cd /opt/bs-display/dev
echo "Updating project..."
git pull origin main
npm install
echo "Project updated!"
EOF
chmod +x ~/update-project.sh

DEVEOF

# Create systemd service for optional auto-start
echo "Creating systemd service..."
cat > /etc/systemd/system/astro-dev.service << 'EOF'
[Unit]
Description=Astro Development Server
After=network.target

[Service]
Type=simple
User=dev
WorkingDirectory=/opt/bs-display/dev
ExecStart=/usr/bin/npm run dev -- --host 0.0.0.0
Restart=on-failure
Environment=NODE_ENV=development

[Install]
WantedBy=multi-user.target
EOF

# Enable service but don't start (user can start manually)
systemctl daemon-reload
systemctl enable astro-dev.service

# Setup motd
cat > /etc/motd << 'EOF'
=====================================
✅ BS-Display Development Environment
=====================================
📁 Project: /opt/bs-display/dev
🚀 Start dev: ./start-dev.sh
🔄 Update: ./update-project.sh
🤖 Claude: claude --help
🔥 Auto-start: sudo systemctl start astro-dev
=====================================
EOF

# Clean up package cache
echo "Cleaning up..."
apt-get clean
rm -rf /var/lib/apt/lists/*
npm cache clean --force

# Signal completion
touch /tmp/provision-complete
echo "=== Provisioning completed successfully at $(date) ==="