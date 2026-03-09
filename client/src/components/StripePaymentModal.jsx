/**
 * Stripe Payment Modal
 * --------------------
 * Fetches a PaymentIntent clientSecret when opened, then collects card via
 * Stripe CardElement and confirms payment. On success, onSuccess(plan, city) is called.
 */

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { X, CreditCard } from "lucide-react";
import { API_BASE } from "../config/api.js";

/** Demo test card shown in the modal — card-shaped layout with test credentials */
function DemoCardInModal() {
  return (
    <div className="mb-4">
      <p className="text-xs text-transit-muted mb-2">Use this test card in the form below:</p>
      <div
        className="relative overflow-hidden rounded-xl border border-amber-700/40 bg-gradient-to-br from-slate-800 to-slate-900 p-4 shadow-lg"
        style={{ aspectRatio: "1.586 / 1" }}
      >
        <div className="absolute top-3 right-3">
          <CreditCard className="w-8 h-8 text-amber-500/80" aria-hidden />
        </div>
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-semibold uppercase tracking-wider">
          Test card
        </div>
        <div className="flex flex-col justify-end h-full pt-10">
          <p className="font-mono text-gray-100 text-sm tracking-widest mb-3" style={{ letterSpacing: "0.2em" }}>
            4242 4242 4242 4242
          </p>
          <div className="flex items-end justify-between text-xs text-gray-400">
            <div>
              <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Valid thru</span>
              <span className="font-mono text-gray-300">Any future date (e.g. 12/34)</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-gray-500 uppercase tracking-wider">CVV</span>
              <span className="font-mono text-gray-300">Any 3 digits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#e2e8f0",
      "::placeholder": { color: "#94a3b8" },
      iconColor: "#f59e0b",
    },
    invalid: {
      color: "#f87171",
    },
  },
};

function PaymentForm({ clientSecret, plan, city, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setLoading(true);
    const card = elements.getElement(CardElement);
    if (!card) {
      setLoading(false);
      return;
    }
    try {
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });
      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        setLoading(false);
        return;
      }
      onSuccess(plan, city);
    } catch {
      setError("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DemoCardInModal />
      <p className="text-xs text-transit-muted -mt-2">Enter the details above in the field below:</p>
      <div className="rounded-lg border border-amber-900/40 bg-transit-dark p-3">
        <CardElement options={CARD_OPTIONS} />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg border border-amber-900/40 text-gray-300 hover:bg-amber-900/20"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-gray-900 font-medium disabled:opacity-50"
        >
          {loading ? "Processing…" : "Pay"}
        </button>
      </div>
    </form>
  );
}

function StripePaymentModal({ open, title, plan, city, token, onSuccess, onCancel }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !plan || !token) {
      setClientSecret(null);
      setError(null);
      return;
    }
    setError(null);
    setLoading(true);
    setClientSecret(null);
    fetch(`${API_BASE}/api/tickets/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plan, city: city || undefined }),
    })
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setError(data.error || "Could not start payment");
      })
      .catch(() => setError("Could not start payment"))
      .finally(() => setLoading(false));
  }, [open, plan, city, token]);

  if (!open) return null;
  if (!stripePromise) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onCancel}>
        <div className="rounded-xl border border-amber-900/50 bg-transit-panel w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <p className="text-amber-400">Set VITE_STRIPE_PUBLISHABLE_KEY in .env to enable payments.</p>
          <button type="button" onClick={onCancel} className="mt-4 py-2 px-4 rounded-lg border border-amber-900/40 text-gray-300">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onCancel}>
      <div
        className="rounded-xl border border-amber-900/50 bg-transit-panel w-full max-w-md p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
          <button type="button" onClick={onCancel} className="p-1 rounded text-transit-muted hover:text-gray-200" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        {loading && <p className="text-transit-muted">Preparing payment…</p>}
        {error && (
          <>
            <p className="text-red-400 mb-3">{error}</p>
            <button type="button" onClick={onCancel} className="py-2 px-4 rounded-lg border border-amber-900/40 text-gray-300">Close</button>
          </>
        )}
        {clientSecret && !loading && !error && (
          <Elements stripe={stripePromise}>
            <PaymentForm clientSecret={clientSecret} plan={plan} city={city} onSuccess={onSuccess} onCancel={onCancel} />
          </Elements>
        )}
      </div>
    </div>
  );
}

export default StripePaymentModal;
