/**
 * API Configuration
 * -----------------
 * Base URL for all backend requests. Set VITE_API_URL in .env to point at your
 * deployed server (e.g. https://ticketing-system-omega-eight.vercel.app).
 * If unset, falls back to local backend (port 5001).
 */
const API_BASE =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:5001";

export { API_BASE };
