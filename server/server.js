/**
 * Transit Ticketing System - Local Server Entry
 * ----------------------------------------------
 * Starts the HTTP server when run locally. On Vercel, the app is served via api/index.js.
 */

import app from "./app.js";
import { config } from "./config/index.js";

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`[Transit Ticketing] Server running on http://localhost:${PORT}`);
});
