/**
 * Validation Routes
 * -----------------
 * POST /api/validate — NFC ticket validation (body: { ticketId }).
 */

import { Router } from "express";
import { validateTicket } from "../controllers/validateController.js";

const router = Router();

router.post("/validate", validateTicket);

export default router;
