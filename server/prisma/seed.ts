/**
 * Prisma Seed Script
 * ------------------
 * Populates the database with initial test data for the Transit Ticketing
 * System. This is used for development only (NOT production).
 *
 * The seed data includes:
 * - 1 Passenger
 * - 3 Tickets with different combinations of status and validity windows
 *   to exercise future validation logic.
 *
 * ⚠️ DATABASE CONNECTION
 * This script uses the same DATABASE_URL defined in your .env file, through
 * Prisma's datasource configuration in schema.prisma.
 * If you change the database name in MongoDB, you must update DATABASE_URL
 * in .env so the seed runs against the correct database.
 */

import { PrismaClient, TicketStatus, TicketType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // ---------------------------------------------------------------------------
  // Clean up existing data (development helper only)
  // ---------------------------------------------------------------------------
  // In a real system we would be more careful with deletions, but for a
  // prototype seed script it is useful to start from a known clean state.
  await prisma.auditLog.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.passenger.deleteMany();

  // Create one Passenger with hashed password and nfcId for Phase 5 auth + validation.
  const hashedPassword = await bcrypt.hash("password123", 10);
  const passenger = await prisma.passenger.create({
    data: {
      name: "Test Passenger",
      email: "passenger@example.com",
      password: hashedPassword,
      nfcId: "user1",
      currentPlan: "NONE",
    },
  });

  // Time helpers: "now", a time in the future, and a time in the past.
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // ---------------------------------------------------------------------------
  // Seed Tickets
  // ---------------------------------------------------------------------------
  // IMPORTANT CONCEPTS:
  // - `validUntil` is the time boundary where a ticket stops being valid.
  //   Future validation logic will compare the current time against this field
  //   to decide if a ticket is expired.
  // - `status` represents how the ticket has been used so far (UNUSED, USED,
  //   EXPIRED). Validation will update this over time.
  // - `signature` simulates a hardware-backed NFC token or cryptographic
  //   signature. In a real system this would be derived from secure hardware
  //   to make cloning tickets harder.
  //
  // Later, **atomic updates** (transactions) will be essential so that:
  // - Ticket status changes (e.g. UNUSED -> USED) happen together with
  //   AuditLog entries for each validation attempt.
  // - We never have a situation where a ticket is marked USED but the audit
  //   record did not get written (or vice versa).

  // 1) ONETIME Ticket - UNUSED, future validUntil (should be accepted later)
  const futureUnusedTicket = await prisma.ticket.create({
    data: {
      type: TicketType.ONETIME,
      status: TicketStatus.UNUSED,
      validUntil: oneWeekFromNow,
      signature: "sig_future_unused_demo_1", // placeholder NFC-like token
      passenger: {
        connect: { id: passenger.id },
      },
    },
  });

  // 2) ONETIME Ticket - UNUSED, past validUntil (expired by time window)
  const pastExpiredTicket = await prisma.ticket.create({
    data: {
      type: TicketType.ONETIME,
      status: TicketStatus.UNUSED,
      validUntil: oneWeekAgo,
      signature: "sig_past_expired_demo_1",
      passenger: {
        connect: { id: passenger.id },
      },
    },
  });

  // 3) ONETIME Ticket - USED, future validUntil (used even though still in window)
  // This ticket demonstrates that status and time BOTH matter:
  // - Even if validUntil is in the future, status=USED should cause
  //   validation logic to deny re-entry in later phases.
  const futureUsedTicket = await prisma.ticket.create({
    data: {
      type: TicketType.ONETIME,
      status: TicketStatus.USED,
      validUntil: oneWeekFromNow,
      signature: "sig_future_used_demo_1",
      passenger: {
        connect: { id: passenger.id },
      },
    },
  });

  // At this phase we do not create AuditLog entries yet.
  // Later, validation endpoints will:
  // - Check ticket status and validUntil atomically
  // - Update the ticket status (e.g. UNUSED -> USED, UNUSED -> EXPIRED)
  // - Insert an AuditLog with ValidationResult, reason, and timestamp

  console.log("Seed completed.");
  console.log("Passenger:", passenger.id);
  console.log("Tickets:", {
    futureUnusedTicket: futureUnusedTicket.id,
    pastExpiredTicket: pastExpiredTicket.id,
    futureUsedTicket: futureUsedTicket.id,
  });
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

