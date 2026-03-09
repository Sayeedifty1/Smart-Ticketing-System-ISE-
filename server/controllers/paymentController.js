/**
 * Payment Controller (Stripe)
 * ---------------------------
 * Creates a PaymentIntent for the chosen plan/city. Frontend confirms with Stripe.js
 * then calls POST /api/tickets/purchase to create the ticket. Use test keys for demo.
 */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Amounts in cents (e.g. 500 = €5.00). Demo only.
const AMOUNTS = {
  ONETIME: 500,
  MONTHLY: 2000,
  city: 400,
};

/**
 * POST /api/tickets/create-payment-intent
 * Protected. Body: { plan: "ONETIME" | "MONTHLY", city?: string }
 * Returns { clientSecret } for Stripe.js confirmCardPayment.
 */
export async function createPaymentIntent(req, res, next) {
  const { plan, city } = req.body || {};
  const user = req.user;

  if (plan !== "ONETIME" && plan !== "MONTHLY") {
    return res.status(400).json({ error: "plan must be ONETIME or MONTHLY" });
  }

  const amount = city ? AMOUNTS.city : AMOUNTS[plan];
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ error: "Stripe is not configured. Set STRIPE_SECRET_KEY in .env" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: user.id,
        plan,
        city: city || "",
      },
    });
    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("[Stripe]", err.message);
    return res.status(500).json({ error: "Could not create payment intent" });
  }
}
