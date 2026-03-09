/**
 * Auth Middleware — authenticateUser
 * -----------------------------------
 * Verifies JWT from Authorization header and attaches user to req.user.
 * Protected routes use this so only logged-in users can access them.
 *
 * Why JWT is required: The server must know who is making the request without
 * storing sessions. JWT is signed with JWT_SECRET; if the token is valid,
 * we trust the payload (userId, email, nfcId) and load the user.
 */

import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

export async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header with Bearer token required" });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.passenger.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, nfcId: true, currentPlan: true },
    });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
