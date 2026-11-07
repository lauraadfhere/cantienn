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
