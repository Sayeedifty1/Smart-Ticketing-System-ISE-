/**
 * Auth Controller
 * ----------------
 * User registration and login. Passwords are hashed with bcrypt; JWT issued on login.
 *
 * Security: Never store plain-text passwords. Hash with bcrypt so that if the DB
 * is compromised, passwords are not exposed. JWT_SECRET must be changed in production.
 *
 * ⚠️ In production:
 * - Use a strong JWT secret (e.g. 32+ random chars); set JWT_SECRET in .env.
 * - Prefer httpOnly cookies for tokens so JS cannot read them (XSS-safe).
 * - Add rate limiting on login/register.
 * - Use HTTPS only.
 * - Consider a payment gateway for real purchases.
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

// ⚠️ CHANGE THIS SECRET IN PRODUCTION — set JWT_SECRET in .env (long, random value).
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 * Creates user with hashed password and auto-generated nfcId (user1, user2, ...).
 */
export async function register(req, res, next) {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, and password are required" });
  }

  try {
    // Check if email already exists (email is unique — one account per email).
    const existing = await prisma.passenger.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password so we never store plain text (required for security).
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Auto-generate nfcId: "user" + next number (simulates assigning NFC card IDs).
    const count = await prisma.passenger.count();
    const nfcId = "user" + (count + 1);

    const user = await prisma.passenger.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        nfcId,
        currentPlan: "NONE",
      },
    });

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        nfcId: user.nfcId,
        currentPlan: user.currentPlan,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns JWT and user info (excluding password). JWT payload: userId, email, nfcId.
 */
export async function login(req, res, next) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    const user = await prisma.passenger.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare provided password with stored hash (bcrypt.compare is constant-time).
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // JWT is required so protected routes can verify the client without storing sessions.
    const token = jwt.sign(
      { userId: user.id, email: user.email, nfcId: user.nfcId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        nfcId: user.nfcId,
        currentPlan: user.currentPlan,
      },
    });
  } catch (error) {
    next(error);
  }
}

/** GET /api/auth/me — used with authenticateUser. Returns current user for dashboard. */
export async function me(req, res) {
  return res.json({ user: req.user });
}
