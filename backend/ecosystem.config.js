module.exports = {
  apps: [
    {
      name: "api-gateway",
      script: "./dist/api-gateway/index.js",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "auth-service",
      script: "./dist/services/auth-service/src/index.js",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "user-service",
      script: "./dist/services/user-service/src/index.js",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "resume-service",
      script: "./dist/services/resume-service/src/index.js",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "ats-service",
      script: "./dist/services/ats-service/src/index.js",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
