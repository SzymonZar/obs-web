#!/bin/bash

# OBS Web Studio Uninstall Script for Orange Pi 5+ Ubuntu Server ARM64
# Author: OBS Web Studio Team
# Version: 2.1.0
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
NGINX_CONF="/etc/nginx/sites-available/obs-web"

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

# Confirm uninstallation
confirm_uninstall() {
    echo
    warning "This will completely remove OBS Web Studio and all its components!"
    warning "The following will be removed:"
    warning "  - OBS Web Studio application"
    warning "  - OBS Studio (compiled from source)"
    warning "  - All systemd services"
    warning "  - Service user and home directory"
    warning "  - Nginx configuration"
    warning "  - All recordings and configurations"
    warning "  - Custom scripts and configurations"
    echo
    read -p "Are you sure you want to continue? Type 'YES' to confirm: " -r
    if [[ ! $REPLY == "YES" ]]; then
        info "Uninstallation cancelled."
        exit 0
    fi
}

# Stop all services
stop_services() {
    log "Stopping all OBS Web Studio services..."
    
    # Stop services
    systemctl stop obs-web-studio.service 2>/dev/null || true
    systemctl stop obs-studio.service 2>/dev/null || true
    systemctl stop xvfb.service 2>/dev/null || true
    systemctl stop hdmi-setup.service 2>/dev/null || true
    systemctl stop video-passthrough.service 2>/dev/null || true
    
    # Disable services
    systemctl disable obs-web-studio.service 2>/dev/null || true
    systemctl disable obs-studio.service 2>/dev/null || true
    systemctl disable xvfb.service 2>/dev/null || true
    systemctl disable hdmi-setup.service 2>/dev/null || true
    systemctl disable video-passthrough.service 2>/dev/null || true
    
    log "Services stopped and disabled"
}

# Remove systemd services
remove_services() {
    log "Removing systemd service files..."
    
    rm -f /etc/systemd/system/obs-web-studio.service
    rm -f /etc/systemd/system/obs-studio.service
    rm -f /etc/systemd/system/xvfb.service
    rm -f /etc/systemd/system/hdmi-setup.service
    rm -f /etc/systemd/system/video-passthrough.service
    
    # Reload systemd
    systemctl daemon-reload
    
    log "Systemd services removed"
}

# Remove application files
remove_application() {
    log "Removing OBS Web Studio application..."
    
    # Remove application directory
    if [ -d "$OBS_WEB_DIR" ]; then
        rm -rf "$OBS_WEB_DIR"
        log "Application directory removed: $OBS_WEB_DIR"
    fi
    
    # Remove custom scripts
    rm -f /usr/local/bin/obs-web-start
    rm -f /usr/local/bin/obs-web-stop
    rm -f /usr/local/bin/setup-hdmi-outputs
    rm -f /usr/local/bin/video-passthrough
    
    log "Application files removed"
}

# Remove service user
remove_user() {
    log "Removing service user..."
    
    if id "$SERVICE_USER" &>/dev/null; then
        # Stop any processes running as the user
        pkill -u "$SERVICE_USER" 2>/dev/null || true
        sleep 2
        
        # Remove user and home directory
        userdel -r "$SERVICE_USER" 2>/dev/null || true
        
        # Remove any remaining files
        rm -rf "/home/$SERVICE_USER" 2>/dev/null || true
        
        log "Service user $SERVICE_USER removed"
    else
        log "Service user $SERVICE_USER does not exist"
    fi
}

# Remove OBS Studio
remove_obs_studio() {
    log "Removing OBS Studio..."
    
    # Remove OBS Studio binaries
    rm -f /usr/local/bin/obs
    rm -f /usr/local/bin/obs-ffmpeg-mux
    
    # Remove OBS Studio libraries
    rm -rf /usr/local/lib/obs-plugins
    rm -rf /usr/local/share/obs
    rm -rf /usr/local/include/obs
    
    # Remove obs-websocket
    rm -f /usr/local/lib/obs-plugins/obs-websocket.so
    
    # Update library cache
    ldconfig
    
    log "OBS Studio removed"
}

# Remove Nginx configuration
remove_nginx_config() {
    log "Removing Nginx configuration..."
    
    # Remove site configuration
    rm -f "$NGINX_CONF"
    rm -f /etc/nginx/sites-enabled/obs-web
    
    # Restore default site if it was removed
    if [ ! -f /etc/nginx/sites-enabled/default ] && [ -f /etc/nginx/sites-available/default ]; then
        ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
    fi
    
    # Test and reload Nginx
    nginx -t && systemctl reload nginx || true
    
    log "Nginx configuration removed"
}

# Remove firewall rules
remove_firewall_rules() {
    log "Removing firewall rules..."
    
    # Remove specific rules (ignore errors if rules don't exist)
    ufw delete allow 3000/tcp 2>/dev/null || true
    ufw delete allow 4455/tcp 2>/dev/null || true
    ufw delete allow 1935/tcp 2>/dev/null || true
    
    log "Firewall rules removed"
}

# Remove system configurations
remove_system_configs() {
    log "Removing system configurations..."
    
    # Remove udev rules
    rm -f /etc/udev/rules.d/99-hdmi-hotplug.rules
    
    # Remove autostart entries
    rm -f /etc/xdg/autostart/obs-web-studio.desktop
    
    # Remove log directories
    rm -rf /var/log/obs-web
    
    # Remove limits configuration
    sed -i '/obs-web/d' /etc/security/limits.conf 2>/dev/null || true
    
    # Remove sysctl optimizations (restore original values)
    sed -i '/# OBS Web Studio optimizations/,/vm.swappiness = 10/d' /etc/sysctl.conf 2>/dev/null || true
    sysctl -p 2>/dev/null || true
    
    log "System configurations removed"
}

# Remove Node.js and global packages (optional)
remove_nodejs() {
    read -p "Do you want to remove Node.js and global packages? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Removing Node.js and global packages..."
        
        # Remove global packages
        npm uninstall -g pm2 yarn 2>/dev/null || true
        
        # Remove Node.js
        apt remove -y nodejs npm 2>/dev/null || true
        apt autoremove -y 2>/dev/null || true
        
        # Remove NodeSource repository
        rm -f /etc/apt/sources.list.d/nodesource.list
        rm -f /etc/apt/trusted.gpg.d/nodesource.gpg
        
        log "Node.js removed"
    else
        log "Node.js kept (skipped removal)"
    fi
}

# Remove development packages (optional)
remove_dev_packages() {
    read -p "Do you want to remove development packages installed for OBS? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Removing development packages..."
        
        apt remove -y \
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
            xvfb \
            x11vnc \
            fluxbox 2>/dev/null || true
        
        apt autoremove -y 2>/dev/null || true
        
        log "Development packages removed"
    else
        log "Development packages kept (skipped removal)"
    fi
}

# Clean up temporary files
cleanup_temp_files() {
    log "Cleaning up temporary files..."
    
    # Remove build directories
    rm -rf /tmp/obs-build
    rm -rf /tmp/obs-websocket-build
    
    # Clean package cache
    apt clean
    
    log "Temporary files cleaned"
}

# Restore system settings
restore_system_settings() {
    log "Restoring system settings..."
    
    # Restore CPU governor to default
    for cpu in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do
        echo ondemand > "$cpu" 2>/dev/null || true
    done
    
    # Restore GPU governor to default
    echo simple_ondemand > /sys/class/devfreq/fb000000.gpu/governor 2>/dev/null || true
    echo simple_ondemand > /sys/devices/platform/fb000000.gpu/devfreq/fb000000.gpu/governor 2>/dev/null || true
    
    log "System settings restored"
}

# Main uninstallation function
main() {
    log "Starting OBS Web Studio uninstallation..."
    
    check_root
    confirm_uninstall
    
    stop_services
    remove_services
    remove_application
    remove_user
    remove_obs_studio
    remove_nginx_config
    remove_firewall_rules
    remove_system_configs
    cleanup_temp_files
    restore_system_settings
    
    # Optional removals
    remove_nodejs
    remove_dev_packages
    
    log "Uninstallation completed successfully!"
    echo
    info "=== OBS Web Studio Uninstallation Summary ==="
    info "✓ All services stopped and removed"
    info "✓ Application files deleted"
    info "✓ Service user removed"
    info "✓ OBS Studio uninstalled"
    info "✓ Nginx configuration removed"
    info "✓ System configurations restored"
    info "✓ Temporary files cleaned"
    echo
    info "The following were preserved (if you chose to keep them):"
    info "  - Node.js and npm"
    info "  - Development packages"
    info "  - System packages (nginx, supervisor, etc.)"
    echo
    warning "You may want to reboot the system to ensure all changes take effect:"
    warning "  sudo reboot"
    echo
    log "Thank you for using OBS Web Studio!"
}

# Run main function
main "$@"