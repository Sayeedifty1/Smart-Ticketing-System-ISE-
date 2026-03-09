/**
 * NFC Validation Controller
 * -------------------------
 * Handles POST /api/validate: validates by ticketId OR nfcId. Returns GRANT or DENY.
 *
 * nfcId simulates NFC tap: in real transit, user taps a card; we look up the user
 * by nfcId and validate their latest UNUSED ticket (mimics real transit card behavior).
 *
 * Business logic (unchanged): 1) Find ticket 2) Check validUntil 3) ONETIME atomic
 * update 4) GRANT. Audit log on every attempt. Existing validation/audit logic preserved.
 */

import { ValidationResult } from "@prisma/client";
import { prisma } from "../config/db.js";

/**
 * POST /api/validate
 * Body: { ticketId?: string, nfcId?: string } — one of them required.
 * Returns: { result: "GRANT" | "DENY", reason: string }
 */
export async function validateTicket(req, res, next) {
  const { ticketId: bodyTicketId, nfcId } = req.body || {};

  if (!bodyTicketId && !nfcId) {
    return res.status(400).json({ error: "ticketId or nfcId is required in request body" });
  }

  try {
    let ticket = null;
    let ticketId = bodyTicketId;

    if (nfcId && typeof nfcId === "string") {
      // Validate by nfcId: find user then their latest UNUSED ticket (simulates NFC tap).
      const passenger = await prisma.passenger.findUnique({
        where: { nfcId: nfcId.trim() },
      });
      if (!passenger) {
        await prisma.auditLog.create({
          data: { result: ValidationResult.DENY, reason: "User not found" },
        });
        return res.status(200).json({ result: "DENY", reason: "User not found" });
      }
      const latestUnused = await prisma.ticket.findFirst({
        where: { passengerId: passenger.id, status: "UNUSED" },
        orderBy: { validUntil: "desc" },
      });
      if (!latestUnused) {
        await prisma.auditLog.create({
          data: { result: ValidationResult.DENY, reason: "No valid ticket" },
        });
        return res.status(200).json({ result: "DENY", reason: "No valid ticket" });
      }
      ticket = latestUnused;
      ticketId = latestUnused.id;
    } else if (bodyTicketId && typeof bodyTicketId === "string") {
      ticket = await prisma.ticket.findUnique({ where: { id: bodyTicketId } });
    }

    if (!ticketId || !ticket) {
      await prisma.auditLog.create({
        data: { result: ValidationResult.DENY, reason: "Ticket not found" },
      });
      return res.status(200).json({ result: "DENY", reason: "Ticket not found" });
    }

    const now = new Date();

    // -------------------------------------------------------------------------
    // 2) If current date > validUntil → ticket is expired
    // -------------------------------------------------------------------------
    if (now > ticket.validUntil) {
      // Update status to EXPIRED so the record is accurate for reports and future checks (persist EXPIRED) and we don’t
      // is accurate for reports and future checks “still unused” (see step 2).
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: "EXPIRED" },
      });

      await prisma.auditLog.create({
        data: {
          result: ValidationResult.DENY,
          reason: "Ticket expired",
          ticketId: ticketId,
        },
      });
      return res.status(200).json({
        result: "DENY",
        reason: "Ticket expired",
      });
    }

    // -------------------------------------------------------------------------
    // 3) If ONETIME: perform ATOMIC update (UNUSED → USED)
    // -------------------------------------------------------------------------
    if (ticket.type === "ONETIME") {
      // Atomic update: condition (id + status UNUSED) prevents double usage—
      // concurrent requests can’t both succeed; only one gets count === 1.
      const updateResult = await prisma.ticket.updateMany({
        where: { id: ticketId, status: "UNUSED" },
        data: { status: "USED" },
      });

      if (updateResult.count === 0) {
        await prisma.auditLog.create({
          data: {
            result: ValidationResult.DENY,
            reason: "Ticket already used",
            ticketId: ticketId,
          },
        });
        return res.status(200).json({
          result: "DENY",
          reason: "Ticket already used",
        });
      }
    }
    // MONTHLY tickets are not updated here; they remain valid until validUntil.

    // -------------------------------------------------------------------------
    // 4) Valid → return GRANT
    // -------------------------------------------------------------------------
    await prisma.auditLog.create({
      data: {
        result: ValidationResult.GRANT,
        reason: "Valid",
        ticketId: ticketId,
      },
    });

    return res.status(200).json({
      result: "GRANT",
      reason: "Valid",
    });
  } catch (error) {
    next(error);
  }
}
