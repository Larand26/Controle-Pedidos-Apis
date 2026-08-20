module.exports = {
  apps: [
    {
      name: "api-local-gen",
      script: "dist/server.js",
      instances: 1,
      exec_mode: "cluster",
      watch: false,
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3000,
      },
    },
  ],
};
