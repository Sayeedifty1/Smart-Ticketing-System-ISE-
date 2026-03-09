/**
 * Route Aggregator
 * ----------------
 * Mounts all API route modules under /api.
 */

import { Router } from "express";
import authRoutes from "./auth.js";
import validateRoutes from "./validate.js";
import ticketsRoutes from "./tickets.js";
import { getDemoTickets, getAuditLogs, getNfcIds } from "../controllers/demoController.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", validateRoutes);
router.use("/tickets", ticketsRoutes);

// Demo/audit endpoints for frontend emulator (dev; secure or remove in production)
router.get("/demo-tickets", getDemoTickets);
router.get("/nfc-ids", getNfcIds);
router.get("/audit-logs", getAuditLogs);

export default router;
