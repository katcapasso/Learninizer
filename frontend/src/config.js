const FRONTEND_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://learninizer.vercel.app"
    : "http://localhost:3000";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://learninizer.vercel.app/api"
    : "http://localhost:4000";

export { FRONTEND_BASE_URL, API_BASE_URL };
