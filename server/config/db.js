/**
 * Prisma Client Singleton
 * -----------------------
 * Single shared PrismaClient instance for the app.
 * DATABASE_URL from .env is used by Prisma to connect to MongoDB;
 * see schema.prisma datasource and .env.example.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma };
