/**
 * Demo / Audit Controller
 * -----------------------
 * Dev/demo endpoints: demo ticket IDs for the emulator, and recent audit logs.
 * In production, restrict or remove these; audit data should be secured.
 */

import { prisma } from "../config/db.js";

/** Signatures used by the seed script for the three demo tickets */
const DEMO_SIGNATURES = {
  valid: "sig_future_unused_demo_1",
  expired: "sig_past_expired_demo_1",
  used: "sig_future_used_demo_1",
};

/**
 * GET /api/demo-tickets
 * Returns IDs of the three seeded demo tickets (valid, expired, used) for the emulator.
 * Query by signature so we don't rely on hardcoded IDs.
 */
export async function getDemoTickets(req, res, next) {
  try {
    const [valid, expired, used] = await Promise.all([
      prisma.ticket.findFirst({ where: { signature: DEMO_SIGNATURES.valid }, select: { id: true } }),
      prisma.ticket.findFirst({ where: { signature: DEMO_SIGNATURES.expired }, select: { id: true } }),
      prisma.ticket.findFirst({ where: { signature: DEMO_SIGNATURES.used }, select: { id: true } }),
    ]);
    return res.json({
      validId: valid?.id ?? null,
      expiredId: expired?.id ?? null,
      usedId: used?.id ?? null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/nfc-ids
 * Returns list of nfcIds (e.g. ["user1", "user2"]) for validator emulator dropdown.
 */
export async function getNfcIds(req, res, next) {
  try {
    const passengers = await prisma.passenger.findMany({
      select: { nfcId: true },
      orderBy: { nfcId: "asc" },
    });
    return res.json(passengers.map((p) => p.nfcId));
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/audit-logs
 * Returns recent audit log entries (timestamp, result, reason) for the live feed.
 */
export async function getAuditLogs(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
      select: { timestamp: true, result: true, reason: true },
    });
    return res.json(logs);
  } catch (error) {
    next(error);
  }
}
