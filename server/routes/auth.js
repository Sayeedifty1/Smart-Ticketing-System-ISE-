/**
 * Auth Routes
 * -----------
 * POST /api/auth/register, POST /api/auth/login, GET /api/auth/me (protected).
 */

import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateUser, me);

export default router;
