console.log('NODE_ENV:', process.env.NODE_ENV);  // Log the current environment

const FRONTEND_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://learninizer.vercel.app"  // For production
    : "http://localhost:3000";  // For development

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://learninizer.vercel.app/api"  // For production
    : "http://localhost:4000";  // For development

export { FRONTEND_BASE_URL, API_BASE_URL };
