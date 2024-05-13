module.exports = {
  apps: [
    {
      name: process.env.PROJECT_NAME,
      script: "node server.js",
      autorestart: true,
      max_restarts: 3,
      start_delay: 1000,
      cwd: ".",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
    },
  ],
};
