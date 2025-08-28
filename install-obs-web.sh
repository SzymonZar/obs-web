#!/bin/bash

# OBS Web Studio Installation Script for Orange Pi 5+ Ubuntu Server ARM64
# Author: OBS Web Studio Team
# Version: 2.0.0
# Compatible with: Ubuntu Server 22.04+ ARM64

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
OBS_WEB_DIR="/opt/obs-web-studio"
SERVICE_USER="obs-web"
NODE_VERSION="20"
OBS_VERSION="30.0.2"
NGINX_CONF="/etc/nginx/sites-available/obs-web"
GITHUB_REPO="https://github.com/SzymonZar/obs-web.git"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Check Orange Pi 5+ hardware
check_hardware() {
    log "Checking hardware compatibility..."
    
    # Check if running on ARM64
    if [[ $(uname -m) != "aarch64" ]]; then
        error "This script is designed for ARM64 architecture"
        exit 1
    fi
    
    # Check for RK3588 (Orange Pi 5+)
    if ! grep -q "rk3588" /proc/device-tree/compatible 2>/dev/null; then
        warning "RK3588 not detected. This script is optimized for Orange Pi 5+"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Check available memory (minimum 4GB recommended)
    TOTAL_MEM=$(free -m | awk 'NR==2{printf "%.0f", $2/1024}')
    if [[ $TOTAL_MEM -lt 4 ]]; then
        warning "Less than 4GB RAM detected. Performance may be limited."
    fi
    
    log "Hardware check completed"
}

# Clone application from GitHub
clone_application() {
    log "Cloning OBS Web Studio from GitHub..."
    
    # Remove existing directory if present
    rm -rf "$OBS_WEB_DIR"
    
    # Clone repository
    git clone "$GITHUB_REPO" "$OBS_WEB_DIR"
    cd "$OBS_WEB_DIR"
    
    # Install dependencies
    npm install
    
    # Build application
    npm run build
    
    log "Application cloned and built successfully"
}

# Update system packages
update_system() {
    log "Updating system packages..."
    apt update
    apt upgrade -y
    
    # Install essential packages
    apt install -y \
        curl \
        wget \
        git \
        build-essential \
        cmake \
        pkg-config \
        libasound2-dev \
        libpulse-dev \
        libjack-jackd2-dev \
        libspeexdsp-dev \
        libluajit-5.1-dev \
        libx264-dev \
        libx265-dev \
        libvpx-dev \
        libopus-dev \
        libvorbis-dev \
        libmp3lame-dev \
        libfdk-aac-dev \
        libavcodec-dev \
        libavformat-dev \
        libavutil-dev \
        libavfilter-dev \
        libavdevice-dev \
        libswscale-dev \
        libswresample-dev \
        libfontconfig1-dev \
        libfreetype6-dev \
        libudev-dev \
        libjansson-dev \
        libxcb-randr0-dev \
        libxcb-xinerama0-dev \
        libxcb-composite0-dev \
        libx11-xcb-dev \
        libxcb-xfixes0-dev \
        libxss1 \
        libgconf-2-4 \
        libxrandr2 \
        libasound2 \
        libpangocairo-1.0-0 \
        libatk1.0-0 \
        libcairo-gobject2 \
        libgtk-3-0 \
        libgdk-pixbuf2.0-0 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxi6 \
        libxrender1 \
        libxtst6 \
        libxss1 \
        libnss3 \
        nginx \
        supervisor \
        ufw \
        htop \
        screen \
        tmux \
        xvfb \
        x11vnc \
        fluxbox
        
    log "System packages updated successfully"
}

# Install Node.js
install_nodejs() {
    log "Installing Node.js ${NODE_VERSION}..."
    
    # Remove existing Node.js if present
    apt remove -y nodejs npm 2>/dev/null || true
    
    # Install Node.js via NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt install -y nodejs
    
    # Verify installation
    NODE_VER=$(node --version)
    NPM_VER=$(npm --version)
    log "Node.js ${NODE_VER} and npm ${NPM_VER} installed successfully"
    
    # Install global packages
    npm install -g pm2 yarn
}

# Create service user
create_user() {
    log "Creating service user..."
    
    if ! id "$SERVICE_USER" &>/dev/null; then
        useradd -r -s /bin/bash -d "$OBS_WEB_DIR" -m "$SERVICE_USER"
        usermod -a -G audio,video "$SERVICE_USER"
        log "User $SERVICE_USER created successfully"
    else
        log "User $SERVICE_USER already exists"
    fi
}

# Install OBS Studio from source
install_obs_studio() {
    log "Installing OBS Studio ${OBS_VERSION} from source..."
    
    # Create build directory
    BUILD_DIR="/tmp/obs-build"
    rm -rf "$BUILD_DIR"
    mkdir -p "$BUILD_DIR"
    cd "$BUILD_DIR"
    
    # Clone OBS Studio
    git clone --recursive https://github.com/obsproject/obs-studio.git
    cd obs-studio
    git checkout "$OBS_VERSION"
    git submodule update --init --recursive
    
    # Create build directory
    mkdir build && cd build
    
    # Configure build with hardware acceleration for RK3588
    cmake .. \
        -DCMAKE_INSTALL_PREFIX=/usr/local \
        -DENABLE_WAYLAND=OFF \
        -DENABLE_PULSEAUDIO=ON \
        -DENABLE_JACK=ON \
        -DENABLE_ALSA=ON \
        -DENABLE_V4L2=ON \
        -DENABLE_VLC=OFF \
        -DENABLE_SCRIPTING=ON \
        -DENABLE_PYTHON=ON \
        -DENABLE_LUAJIT=ON \
        -DBUILD_BROWSER=OFF \
        -DBUILD_VST=OFF \
        -DCMAKE_BUILD_TYPE=Release \
        -DOBS_VERSION_OVERRIDE="$OBS_VERSION"
    
    # Build (use all available cores)
    make -j$(nproc)
    
    # Install
    make install
    ldconfig
    
    log "OBS Studio installed successfully"
    
    # Cleanup
    cd /
    rm -rf "$BUILD_DIR"
}

# Install obs-websocket plugin
install_obs_websocket() {
    log "Installing obs-websocket plugin..."
    
    BUILD_DIR="/tmp/obs-websocket-build"
    rm -rf "$BUILD_DIR"
    mkdir -p "$BUILD_DIR"
    cd "$BUILD_DIR"
    
    # Clone obs-websocket
    git clone --recursive https://github.com/obsproject/obs-websocket.git
    cd obs-websocket
    
    # Build
    mkdir build && cd build
    cmake .. -DCMAKE_INSTALL_PREFIX=/usr/local
    make -j$(nproc)
    make install
    
    log "obs-websocket plugin installed successfully"
    
    # Cleanup
    cd /
    rm -rf "$BUILD_DIR"
}

# Setup virtual display for headless operation
setup_virtual_display() {
    log "Setting up virtual display..."
    
    # Create Xvfb service
    cat > /etc/systemd/system/xvfb.service << 'EOF'
[Unit]
Description=X Virtual Frame Buffer Service
After=network.target

[Service]
ExecStart=/usr/bin/Xvfb :99 -screen 0 1920x1080x24
Restart=always
User=obs-web

[Install]
WantedBy=multi-user.target
EOF
    
    systemctl enable xvfb.service
    log "Virtual display configured"
}

# Setup application from GitHub
setup_obs_web_from_github() {
    log "Setting up OBS Web Studio from GitHub repository..."
    
    # Set ownership
    chown -R "$SERVICE_USER:$SERVICE_USER" "$OBS_WEB_DIR"
    
    log "OBS Web Studio application setup completed from GitHub"
}

# Configure Nginx
configure_nginx() {
    log "Configuring Nginx..."
    
    cat > "$NGINX_CONF" << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket proxy
    location /ws {
        proxy_pass http://127.0.0.1:4455;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://127.0.0.1:3000;
    }
    
    # Recordings download
    location /recordings/ {
        alias /home/obs-web/recordings/;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }
}
EOF
    
    # Enable site
    ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test configuration
    nginx -t
    systemctl restart nginx
    systemctl enable nginx
    
    log "Nginx configured successfully"
}

# Setup systemd services
setup_services() {
    log "Setting up systemd services..."
    
    # OBS Web Studio service
    cat > /etc/systemd/system/obs-web-studio.service << EOF
[Unit]
Description=OBS Web Studio
After=network.target xvfb.service
Wants=xvfb.service

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$OBS_WEB_DIR
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=WS_PORT=4455
Environment=DISPLAY=:99

# Security settings
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=$OBS_WEB_DIR /home/$SERVICE_USER

[Install]
WantedBy=multi-user.target
EOF
    
    # OBS Studio service
    cat > /etc/systemd/system/obs-studio.service << EOF
[Unit]
Description=OBS Studio Headless
After=network.target xvfb.service
Wants=xvfb.service

[Service]
Type=simple
User=$SERVICE_USER
ExecStart=/usr/local/bin/obs --headless --websocket_enabled --websocket_port 4455
Restart=always
RestartSec=10
Environment=DISPLAY=:99

# Security settings
NoNewPrivileges=yes
PrivateTmp=yes

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd and enable services
    systemctl daemon-reload
    systemctl enable xvfb.service
    systemctl enable obs-web-studio.service
    systemctl enable obs-studio.service
    
    log "Systemd services configured"
}

# Configure firewall
configure_firewall() {
    log "Configuring firewall..."
    
    # Enable UFW
    ufw --force enable
    
    # Allow SSH
    ufw allow ssh
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Allow OBS Web Studio
    ufw allow 3000/tcp
    ufw allow 4455/tcp
    
    # Allow RTMP (for streaming)
    ufw allow 1935/tcp
    
    log "Firewall configured"
}

# Create directories and set permissions
setup_directories() {
    log "Setting up directories..."
    
    # Create necessary directories
    mkdir -p "/home/$SERVICE_USER/recordings"
    mkdir -p "/home/$SERVICE_USER/config"
    mkdir -p "/home/$SERVICE_USER/plugins"
    mkdir -p "/home/$SERVICE_USER/logs"
    mkdir -p "/home/$SERVICE_USER/profiles"
    mkdir -p "/home/$SERVICE_USER/scene-collections"
    mkdir -p "/var/log/obs-web"
    
    # Set permissions
    chown -R "$SERVICE_USER:$SERVICE_USER" "/home/$SERVICE_USER"
    chown -R "$SERVICE_USER:$SERVICE_USER" "/var/log/obs-web"
    chmod 755 "/home/$SERVICE_USER/recordings"
    
    log "Directories setup completed"
}

# Install additional tools
install_tools() {
    log "Installing additional tools..."
    
    # Install FFmpeg with hardware acceleration support
    apt install -y ffmpeg
    
    # Install v4l-utils for USB capture devices
    apt install -y v4l-utils
    
    # Install GStreamer for advanced streaming
    apt install -y \
        gstreamer1.0-tools \
        gstreamer1.0-plugins-base \
        gstreamer1.0-plugins-good \
        gstreamer1.0-plugins-bad \
        gstreamer1.0-plugins-ugly \
        gstreamer1.0-libav
    
    log "Additional tools installed"
}

# Optimize system for streaming
optimize_system() {
    log "Optimizing system for streaming..."
    
    # Increase file limits
    cat >> /etc/security/limits.conf << 'EOF'
obs-web soft nofile 65536
obs-web hard nofile 65536
obs-web soft nproc 32768
obs-web hard nproc 32768
EOF
    
    # Optimize kernel parameters
    cat >> /etc/sysctl.conf << 'EOF'
# OBS Web Studio optimizations
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 87380 134217728
net.ipv4.tcp_wmem = 4096 65536 134217728
net.core.netdev_max_backlog = 5000
vm.swappiness = 10
EOF
    
    sysctl -p
    
    log "System optimization completed"
}

# Setup autostart
setup_autostart() {
    log "Setting up autostart..."
    
    # Enable services to start on boot
    systemctl enable xvfb.service
    systemctl enable obs-studio.service
    systemctl enable obs-web-studio.service
    systemctl enable nginx.service
    
    # Create autostart script for desktop environments
    mkdir -p /etc/xdg/autostart
    cat > /etc/xdg/autostart/obs-web-studio.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=OBS Web Studio
Comment=Start OBS Web Studio on login
Exec=/usr/local/bin/obs-web-start
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF
    
    log "Autostart configured"
}

# Create startup script
create_startup_script() {
    log "Creating startup script..."
    
    cat > /usr/local/bin/obs-web-start << 'EOF'
#!/bin/bash

# OBS Web Studio Startup Script
echo "Starting OBS Web Studio..."

# Start virtual display first
systemctl start xvfb.service
sleep 2

# Start services
systemctl start obs-studio.service
sleep 5
systemctl start obs-web-studio.service
systemctl start nginx.service

# Check status
systemctl status xvfb.service --no-pager
systemctl status obs-studio.service --no-pager
systemctl status obs-web-studio.service --no-pager
systemctl status nginx.service --no-pager

echo "OBS Web Studio started successfully!"
echo "Access the web interface at: http://$(hostname -I | awk '{print $1}')"
echo "WebSocket available at: ws://$(hostname -I | awk '{print $1}'):4455"
EOF
    
    chmod +x /usr/local/bin/obs-web-start
    
    # Create stop script
    cat > /usr/local/bin/obs-web-stop << 'EOF'
#!/bin/bash

# OBS Web Studio Stop Script
echo "Stopping OBS Web Studio..."

systemctl stop obs-web-studio.service
systemctl stop obs-studio.service
systemctl stop xvfb.service

echo "OBS Web Studio stopped successfully!"
EOF
    
    chmod +x /usr/local/bin/obs-web-stop
    
    log "Startup script created at /usr/local/bin/obs-web-start"
    log "Stop script created at /usr/local/bin/obs-web-stop"
}

# Main installation function
main() {
    log "Starting OBS Web Studio installation for Orange Pi 5+"
    log "This may take 45-90 minutes depending on your internet connection"
    
    check_root
    check_hardware
    update_system
    install_nodejs
    create_user
    clone_application
    install_obs_studio
    install_obs_websocket
    setup_virtual_display
    setup_obs_web_from_github
    configure_nginx
    setup_services
    configure_firewall
    setup_directories
    install_tools
    optimize_system
    setup_autostart
    create_startup_script
    
    log "Installation completed successfully!"
    echo
    info "=== OBS Web Studio Installation Summary ==="
    info "Installation directory: $OBS_WEB_DIR"
    info "Service user: $SERVICE_USER"
    info "Web interface: http://$(hostname -I | awk '{print $1}')"
    info "WebSocket: ws://$(hostname -I | awk '{print $1}'):4455"
    info "Recordings directory: /home/$SERVICE_USER/recordings"
    info "Profiles directory: /home/$SERVICE_USER/profiles"
    info "Scene collections: /home/$SERVICE_USER/scene-collections"
    echo
    info "To start the services:"
    info "  sudo /usr/local/bin/obs-web-start"
    echo
    info "To stop the services:"
    info "  sudo /usr/local/bin/obs-web-stop"
    echo
    info "To check service status:"
    info "  sudo systemctl status obs-web-studio"
    info "  sudo systemctl status obs-studio"
    info "  sudo systemctl status xvfb"
    echo
    info "To view logs:"
    info "  sudo journalctl -u obs-web-studio -f"
    info "  sudo journalctl -u obs-studio -f"
    echo
    info "Services will start automatically on boot"
    echo
    warning "Please reboot the system to ensure all changes take effect:"
    warning "  sudo reboot"
}

# Run main function
main "$@"