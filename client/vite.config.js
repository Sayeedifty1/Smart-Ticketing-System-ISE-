/**
 * Vite Configuration
 * ------------------
 * React plugin and dev server settings.
 * Build output goes to dist/.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Listen on all interfaces so you can open the app from other devices via your IP (e.g. http://192.168.1.x:5173)
    host: true,
  },
});
