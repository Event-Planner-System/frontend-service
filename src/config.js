// src/config.js
// This will read from environment variables injected at runtime

const config = {
  API_URL: window._env_?.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8001'
};

export default config;