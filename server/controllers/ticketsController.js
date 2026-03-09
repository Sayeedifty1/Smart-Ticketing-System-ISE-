/**
 * Tickets Controller
 * ------------------
 * Protected ticket purchase. Only authenticated users can buy tickets.
 * validUntil is set by plan (1 day for ONETIME, 30 days for MONTHLY).
 * Signature simulates an NFC token (in production would come from secure hardware).
 */

import { prisma } from "../config/db.js";

/**
 * GET /api/tickets/me
 * Protected. Returns the logged-in user's tickets (for dashboard "Active tickets").
 */
export async function getMyTickets(req, res, next) {
  const user = req.user;
  try {
    const tickets = await prisma.ticket.findMany({
      where: { passengerId: user.id },
      orderBy: { validUntil: "desc" },
      select: { id: true, type: true, status: true, validUntil: true, city: true },
    });
    return res.json(tickets);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tickets/purchase
 * Protected. Body: { plan: "ONETIME" | "MONTHLY", city?: string }
 * City ticket: pass plan "ONETIME" + city name (e.g. "Lemgo"); valid 1 day.
 */
export async function purchaseTicket(req, res, next) {
  const { plan, city } = req.body || {};
  const user = req.user;

  if (plan !== "ONETIME" && plan !== "MONTHLY") {
    return res.status(400).json({ error: "plan must be ONETIME or MONTHLY" });
  }

  try {
    const now = new Date();
    const validUntil =
      plan === "ONETIME"
        ? new Date(now.getTime() + 24 * 60 * 60 * 1000)
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const signature = "sig_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);

    const ticket = await prisma.ticket.create({
      data: {
        type: plan,
        status: "UNUSED",
        validUntil,
        signature,
        passengerId: user.id,
        city: city && typeof city === "string" ? city.trim() || null : null,
      },
    });

    await prisma.passenger.update({
      where: { id: user.id },
      data: { currentPlan: plan },
    });

    return res.status(201).json({
      message: "Ticket purchased",
      ticket: {
        id: ticket.id,
        type: ticket.type,
        status: ticket.status,
        validUntil: ticket.validUntil,
        city: ticket.city,
      },
    });
  } catch (error) {
    next(error);
  }
}
