/**
 * Global Error Handler
 * --------------------
 * Central Express error middleware. Catches errors from routes/controllers
 * (including Prisma/DB errors) and returns a consistent JSON response.
 */

/**
 * Global error handler middleware.
 * Handles Prisma connection and query errors with safe messages.
 * @param {Error} err - Error from next(err) in routes
 * @param {import('express').Request} _req - Express request (unused)
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} _next - Next (unused)
 */
export function globalErrorHandler(err, _req, res, _next) {
  let status = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  // Prisma / DB errors: avoid exposing internal details; use generic message
  if (err.name === "PrismaClientKnownRequestError") {
    status = 400;
    message = "Invalid request or resource not found.";
  }
  if (err.name === "PrismaClientInitializationError" || err.name === "PrismaClientValidationError") {
    status = 503;
    message = "Database temporarily unavailable.";
  }

  if (process.env.NODE_ENV === "development") {
    console.error("[Error]", err);
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
