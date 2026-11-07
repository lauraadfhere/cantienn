# WIPPEL Production Setup Guide - aaPanel (ZIP Upload Method)

This guide provides step-by-step instructions for deploying the WIPPEL application to production using aaPanel with PM2 and Nginx, using ZIP file upload instead of git.

---

## Prerequisites

- aaPanel installed on your server
- Domain name configured and pointing to your server
- SSH access to the server
- Basic knowledge of Linux commands
- WIPPEL project ZIP files (backend.zip and frontend.zip)

---

## Server Requirements

### Minimum Requirements
- **CPU:** 2 cores
- **RAM:** 4GB
- **Storage:** 20GB SSD
- **OS:** Ubuntu 20.04+ / CentOS 7+ / Debian 10+

### Recommended Requirements
- **CPU:** 4 cores
- **RAM:** 8GB
- **Storage:** 50GB SSD
- **OS:** Ubuntu 22.04 LTS

---

## Port Configuration (Avoiding aaPanel Conflicts)

Since aaPanel uses several ports by default, we'll use custom ports:
- **Backend:** 9050 (instead of 3000)
- **Frontend:** 3001 (instead of 3000)
- **Database:** 5432 (PostgreSQL default)
- **Nginx:** 80, 443 (standard web ports)

---

## Step 1: Install Required Software in aaPanel

### 1.1 Install Node.js
1. Go to aaPanel → App Store
2. Search for "Node.js"
3. Install Node.js version 18.x or higher
4. Set Node.js as the default version

### 1.2 Install Go
1. SSH into your server
2. Run the following commands:
```bash
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc
go version
```

### 1.3 Install PM2
```bash
npm install -g pm2
pm2 startup
pm2 save
```

### 1.4 Install Nginx
1. Go to aaPanel → App Store
2. Search for "Nginx"
3. Install Nginx (version 1.20+)
4. Start Nginx service

### 1.5 Install Unzip
```bash
sudo apt update
sudo apt install unzip -y
# For CentOS
sudo yum install unzip -y
```

### 1.6 Install Database (PostgreSQL/MySQL)
1. Go to aaPanel → App Store
2. Install PostgreSQL 14+ or MySQL 8.0+
3. Create a new database for WIPPEL
4. Create a database user with appropriate permissions

---

## Step 2: Upload and Deploy Backend (Go/Gin)

### 2.1 Upload Backend ZIP File
1. Go to aaPanel → Files
2. Navigate to `/www/wwwroot`
3. Click "Upload" and upload `backend.zip`
4. Extract the ZIP file:
```bash
cd /www/wwwroot
unzip backend.zip
mv backend wippel-backend
cd wippel-backend
```

### 2.2 Install Dependencies
```bash
cd backend
go mod download
go mod tidy
```

### 2.3 Create Production Environment File
```bash
cp .env .env.production
nano .env.production
```

Add the following configuration:
```env
# Server Configuration
PORT=9050
SITE_NAME=WIPPEL
SITE_URL=https://yourdomain.com

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wippel_production
DB_USER=wippel_user
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRATION=24h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com

# NVAPI Configuration (AI)
NVAPI_KEY=your_nvapi_key_here
NVAPI_BASE_URL=https://integrate.api.nvidia.com/v1

# File Upload Configuration
UPLOAD_DIR=/www/wwwroot/wippel-backend/uploads
MAX_UPLOAD_SIZE=10485760

# Environment
ENVIRONMENT=production
DEBUG=false

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=1m

# Session Configuration
SESSION_SECRET=your_super_secure_session_secret_here_change_this_in_production
SESSION_MAX_AGE=86400
```

### 2.4 Create Required Directories
```bash
mkdir -p /www/wwwroot/wippel-backend/uploads
mkdir -p /www/wwwroot/wippel-backend/backend/logs
```

### 2.5 Build the Application
```bash
cd /www/wwwroot/wippel-backend/backend
go build -o wippel-backend main.go
```

### 2.6 Create PM2 Configuration
The ecosystem.config.js file should already exist in the backend directory. Verify it has:
```javascript
module.exports = {
  apps: [{
    name: 'wippel-backend',
    script: './wippel-backend',
    cwd: '/www/wwwroot/wippel-backend/backend',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 9050
    },
    env_file: '.env.production',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000
  }]
};
```

### 2.7 Start Backend with PM2
```bash
cd /www/wwwroot/wippel-backend/backend
pm2 start ecosystem.config.js
pm2 save
pm2 status
pm2 logs wippel-backend
```

### 2.8 Verify Backend is Running
```bash
curl http://localhost:9050/api/health
```

---

## Step 3: Upload and Deploy Frontend (Next.js)

### 3.1 Upload Frontend ZIP File
1. Go to aaPanel → Files
2. Navigate to `/www/wwwroot`
3. Click "Upload" and upload `frontend.zip`
4. Extract the ZIP file:
```bash
cd /www/wwwroot
unzip frontend.zip
mv frontend wippel-frontend
cd wippel-frontend
```

### 3.2 Install Dependencies
```bash
cd frontend
npm install --production
```

### 3.3 Create Production Environment File
```bash
cp .env.local .env.production
nano .env.production
```

Add the following configuration:
```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=https://yourdomain.com/api

# Application Configuration
NEXT_PUBLIC_SITE_NAME=WIPPEL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Environment
NODE_ENV=production

# Feature Flags
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 3.4 Create Required Directories
```bash
mkdir -p /www/wwwroot/wippel-frontend/frontend/logs
```

### 3.5 Build the Application
```bash
cd /www/wwwroot/wippel-frontend/frontend
npm run build
```

### 3.6 Update Next.js Config for Custom Port
Edit `next.config.mjs` to use port 3001:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
    qualities: [100, 75],
  },
  turbopack: {
    root: '..',
  },
  // Add port configuration
  port: 3001,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://db.onlinewebfonts.com; font-src 'self' https://fonts.gstatic.com https://db.onlinewebfonts.com; img-src 'self' data: https://res.cloudinary.com https://i.pravatar.cc https://images.unsplash.com; object-src 'none'; frame-src 'none'; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

### 3.7 Create PM2 Configuration
The ecosystem.config.js file should already exist in the frontend directory. Verify it has:
```javascript
module.exports = {
  apps: [{
    name: 'wippel-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/www/wwwroot/wippel-frontend/frontend',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_file: '.env.production',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000
  }]
};
```

### 3.8 Start Frontend with PM2
```bash
cd /www/wwwroot/wippel-frontend/frontend
pm2 start ecosystem.config.js
pm2 save
pm2 status
pm2 logs wippel-frontend
```

### 3.9 Verify Frontend is Running
```bash
curl http://localhost:3001
```

---

## Step 4: Configure Nginx

### 4.1 Create Nginx Configuration File
Create file `/www/server/panel/vhost/nginx/wippel.conf`:
```nginx
# Upstream for Backend
upstream wippel_backend {
    server 127.0.0.1:9050;
    keepalive 64;
}

# Upstream for Frontend
upstream wippel_frontend {
    server 127.0.0.1:3001;
    keepalive 64;
}

# Main Server Configuration
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS Server Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (Let's Encrypt)
    ssl_certificate /www/server/panel/vhost/cert/yourdomain.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://db.onlinewebfonts.com; font-src 'self' https://fonts.gstatic.com https://db.onlinewebfonts.com; img-src 'self' data: https://res.cloudinary.com https://i.pravatar.cc https://images.unsplash.com; object-src 'none'; frame-src 'none'; upgrade-insecure-requests;" always;

    # Logging
    access_log /www/wwwroot/wippel-frontend/logs/access.log;
    error_log /www/wwwroot/wippel-frontend/logs/error.log;

    # Client Body Size Limit
    client_max_body_size 10M;

    # Frontend (Next.js)
    location / {
        proxy_pass http://wippel_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Backend API
    location /api/ {
        proxy_pass http://wippel_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static Files (Frontend)
    location /_next/static {
        proxy_pass http://wippel_frontend;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Static Files (Backend uploads)
    location /uploads {
        alias /www/wwwroot/wippel-backend/uploads;
        expires 30d;
        add_header Cache-Control "public";
    }

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

### 4.2 Enable SSL Certificate
1. Go to aaPanel → Website
2. Select your domain
3. Click "SSL"
4. Choose "Let's Encrypt"
5. Apply for SSL certificate
6. Enable "Force HTTPS"

### 4.3 Test and Restart Nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 5: Configure Firewall

### 5.1 Open Required Ports
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 5.2 Configure aaPanel Firewall
1. Go to aaPanel → Security
2. Add allowed ports: 80, 443, 22
3. Block all other ports (including 3000, 3001, 9050)

---

## Step 6: Set Up Automated Backups

### 6.1 Database Backup
Create backup script `/www/backup/db_backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/www/backup/database"
DB_NAME="wippel_production"
DB_USER="wippel_user"
DB_PASS="your_password"

mkdir -p $BACKUP_DIR
pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/wippel_$DATE.sql
gzip $BACKUP_DIR/wippel_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

### 6.2 File Backup
Create backup script `/www/backup/file_backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/www/backup/files"
SOURCE_DIR="/www/wwwroot/wippel-backend/uploads"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz $SOURCE_DIR

# Keep only last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

### 6.3 Application Backup
Create backup script `/www/backup/app_backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/www/backup/apps"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/wippel-backend_$DATE.tar.gz /www/wwwroot/wippel-backend
tar -czf $BACKUP_DIR/wippel-frontend_$DATE.tar.gz /www/wwwroot/wippel-frontend

# Keep only last 3 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +3 -delete
```

### 6.4 Schedule Cron Jobs
```bash
# Database backup daily at 2 AM
0 2 * * * /www/backup/db_backup.sh

# File backup daily at 3 AM
0 3 * * * /www/backup/file_backup.sh

# Application backup daily at 4 AM
0 4 * * * /www/backup/app_backup.sh
```

---

## Step 7: Monitoring and Logging

### 7.1 PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

### 7.2 Nginx Logs
```bash
tail -f /www/wwwroot/wippel-frontend/logs/access.log
tail -f /www/wwwroot/wippel-frontend/logs/error.log
```

### 7.3 Application Logs
```bash
tail -f /www/wwwroot/wippel-backend/backend/logs/error.log
tail -f /www/wwwroot/wippel-backend/backend/logs/out.log
tail -f /www/wwwroot/wippel-frontend/frontend/logs/error.log
tail -f /www/wwwroot/wippel-frontend/frontend/logs/out.log
```

---

## Step 8: Security Hardening

### 8.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 8.2 Configure Fail2Ban
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 8.3 Disable Root Login
```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

### 8.4 Configure aaPanel Security
1. Go to aaPanel → Security
2. Enable "Login Verification"
3. Set strong password
4. Enable two-factor authentication if available

---

## Step 9: Performance Optimization

### 9.1 Enable Nginx Caching
Add to Nginx configuration:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;
```

### 9.2 Configure PM2 Cluster Mode
Already configured in ecosystem.config.js with 2 instances

### 9.3 Enable Gzip Compression
Already configured in Nginx configuration

---

## Step 10: Deployment Checklist

- [ ] Install all required software (Node.js, Go, PM2, Nginx, Database)
- [ ] Upload backend.zip and frontend.zip files
- [ ] Extract ZIP files to /www/wwwroot
- [ ] Configure environment files (.env.production)
- [ ] Create required directories (uploads, logs)
- [ ] Build applications (go build, npm run build)
- [ ] Configure PM2 (ecosystem.config.js)
- [ ] Start applications with PM2
- [ ] Verify applications are running on correct ports
- [ ] Configure Nginx with custom ports (9050, 3001)
- [ ] Enable SSL certificate
- [ ] Configure firewall (block direct port access)
- [ ] Set up automated backups
- [ ] Test all functionality
- [ ] Monitor logs
- [ ] Security hardening

---

## Troubleshooting

### Backend Not Starting
```bash
pm2 logs wippel-backend
pm2 restart wippel-backend
# Check if port 9050 is available
netstat -tuln | grep 9050
```

### Frontend Not Starting
```bash
pm2 logs wippel-frontend
pm2 restart wippel-frontend
# Check if port 3001 is available
netstat -tuln | grep 3001
```

### Nginx 502 Bad Gateway
```bash
sudo nginx -t
sudo systemctl restart nginx
pm2 restart wippel-backend
pm2 restart wippel-frontend
# Check if applications are running
pm2 status
```

### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U wippel_user -d wippel_production
```

### Port Conflicts
```bash
# Check which ports are in use
netstat -tuln
# If ports are in use, kill the process or change ports in configuration
```

---

## Maintenance

### Update Commands (ZIP Upload Method)
```bash
# Update backend
cd /www/wwwroot
# Upload new backend.zip
unzip -o backend.zip
cd wippel-backend/backend
go build -o wippel-backend main.go
pm2 restart wippel-backend

# Update frontend
cd /www/wwwroot
# Upload new frontend.zip
unzip -o frontend.zip
cd wippel-frontend/frontend
npm install
npm run build
pm2 restart wippel-frontend
```

### Rollback Commands
```bash
# Backend rollback (from backup)
cd /www/wwwroot
rm -rf wippel-backend
tar -xzf /www/backup/apps/wippel-backend_<date>.tar.gz
cd wippel-backend/backend
go build -o wippel-backend main.go
pm2 restart wippel-backend

# Frontend rollback (from backup)
cd /www/wwwroot
rm -rf wippel-frontend
tar -xzf /www/backup/apps/wippel-frontend_<date>.tar.gz
cd wippel-frontend/frontend
npm install
npm run build
pm2 restart wippel-frontend
```

---

## Support

For issues or questions:
- Check application logs
- Review PM2 logs
- Check Nginx error logs
- Verify port configurations
- Contact the development team

---

**Last Updated:** August 3, 2026
**Version:** 2.0.0 (ZIP Upload Method)
