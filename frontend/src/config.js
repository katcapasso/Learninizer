const FRONTEND_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://learninizer.vercel.app" // Frontend hosted on Vercel
    : "http://localhost:3000"; // Local frontend for development

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://learninizer.vercel.app/api" // Backend hosted on Vercel
    : "http://localhost:4000"; // Local backend for development

export { FRONTEND_BASE_URL, API_BASE_URL };
