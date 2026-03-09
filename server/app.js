/**
 * Transit Ticketing System - Express App
 * --------------------------------------
 * Express app instance (middleware + routes). Used by server.js locally
 * and by api/index.js on Vercel. No .listen() here.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { config } from "./config/index.js";
import { globalErrorHandler } from "./config/errorHandler.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors(config.cors));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(globalErrorHandler);

export default app;
