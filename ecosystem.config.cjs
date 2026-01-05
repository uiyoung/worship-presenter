module.exports = {
  apps: [
    {
      name: 'worship-presenter',
      script: 'app.js',

      // 클러스터링 - 1GB RAM 서버에서는 비활성 하는 것을 권장
      // instances: 'max',
      // exec_mode: 'cluster',

      // 환경 변수
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },

      // 로그
      // out_file: '/var/log/worship-presenter/out.log',
      // error_file: '/var/log/worship-presenter/error.log',
      // log_date_format: 'YYYY-MM-DD HH:mm:ss',

      // 재시작 정책
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,

      // 메모리 제한 for 1GB RAM server
      max_memory_restart: '200M',
    },
  ],
};
