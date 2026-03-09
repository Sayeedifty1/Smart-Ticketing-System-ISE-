/**
 * Vercel serverless entry — forwards all requests to the Express app.
 * Wraps in try/catch so crashes are logged and return 500 with message (check Vercel logs).
 */
let app = null;

async function getApp() {
  if (app) return app;
  const mod = await import("../app.js");
  app = mod.default;
  return app;
}

export default async function handler(req, res) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (err) {
    console.error("[Vercel] Serverless handler error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? err?.message : undefined,
    });
  }
}
