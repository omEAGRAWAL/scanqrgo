// For AWS deployment - detect environment more reliably
// const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const API_URL = isDevelopment
  ? "http://localhost:5000/api" // Local development
  : "/api"; // Production - served from same domain

// // AWS-specific configuration
// export const AWS_CONFIG = {
//   region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
//   apiUrl: isProduction ? '/api' : 'http://localhost:5000/api'
// };
