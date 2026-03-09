/**
 * Server Configuration
 * --------------------
 * Central place for environment-based config.
 * ⚠️ CHANGE THESE (or .env) BEFORE RUNNING IN PRODUCTION.
 * Update MongoDB username, password, and DB name in .env — see .env.example.
 */

// -----------------------------------------------------------------------------
// PORT — where the Express server listens
// Set in .env as PORT=5001 (or another port). Used in server.js to start the app.
// -----------------------------------------------------------------------------
export const port = Number(process.env.PORT) || 5001;

// -----------------------------------------------------------------------------
// CORS — allowed origins for browser requests
// Set CLIENT_ORIGIN in .env or Vercel (comma-separated for multiple).
// When on Vercel, default includes Netlify frontend so CORS works without env.
// -----------------------------------------------------------------------------
const defaultOrigin = "http://localhost:5173";
const vercelDefault = "https://smartticketingsystem.netlify.app";
const originEnv = process.env.CLIENT_ORIGIN || (process.env.VERCEL ? vercelDefault : defaultOrigin);
const allowedOrigins = originEnv.split(",").map((o) => o.trim()).filter(Boolean);
export const cors = {
  origin: allowedOrigins.length === 1 ? allowedOrigins[0] : (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(null, false);
  },
  optionsSuccessStatus: 200,
};

// -----------------------------------------------------------------------------
// Export a single config object for convenience
// -----------------------------------------------------------------------------
export const config = {
  port,
  cors,
  env: process.env.NODE_ENV || "development",
};
