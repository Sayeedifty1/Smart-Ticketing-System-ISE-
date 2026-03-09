/**
 * Tickets Routes
 * --------------
 * POST /api/tickets/purchase — protected by authenticateUser.
 */

import { Router } from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { getMyTickets, purchaseTicket } from "../controllers/ticketsController.js";
import { createPaymentIntent } from "../controllers/paymentController.js";

const router = Router();

router.get("/me", authenticateUser, getMyTickets);
router.post("/create-payment-intent", authenticateUser, createPaymentIntent);
router.post("/purchase", authenticateUser, purchaseTicket);

export default router;
