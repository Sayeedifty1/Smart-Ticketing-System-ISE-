/**
 * Purchase Page
 * -------------
 * Day ticket, Monthly plan, and city tickets. Payment via Stripe.js; after
 * successful payment the ticket is created. Demo: use Stripe test card below.
 */

import { useState } from "react";
import { Ticket, MapPin, CreditCard } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE } from "../config/api.js";
import StripePaymentModal from "../components/StripePaymentModal.jsx";

const CITY_OPTIONS = [
  { id: "Lemgo", name: "Lemgo" },
  { id: "Bielefeld", name: "Bielefeld" },
  { id: "Detmold", name: "Detmold" },
  { id: "Berlin", name: "Berlin" },
  { id: "München", name: "München" },
  { id: "Hamburg", name: "Hamburg" },
  { id: "Hannover", name: "Hannover" },
  { id: "Köln", name: "Köln" },
];

function Purchase() {
  const { token } = useAuth();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, title: "", plan: null, city: null });

  const openPayment = (title, plan, city = null) => {
    setMessage(null);
    setError(null);
    setModal({ open: true, title, plan, city });
  };

  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  const handlePaymentSuccess = async (plan, city) => {
    try {
      const body = city ? { plan: "ONETIME", city } : { plan };
      const res = await fetch(`${API_BASE}/api/tickets/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Purchase failed");
      setMessage(
        city ? `City ticket for ${city} purchased.` : `Purchased ${plan === "ONETIME" ? "Day" : "Monthly"} ticket.`
      );
      closeModal();
    } catch (e) {
      setError(e.message || "Could not create ticket");
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Purchase Ticket</h1>
      {message && <p className="mb-4 text-green-400">{message}</p>}
      {error && <p className="mb-4 text-red-400">{error}</p>}

      {/* Demo card for testing Stripe (test mode only) */}
      <div className="mb-6 rounded-xl border border-amber-700/50 bg-amber-950/20 p-4 flex items-start gap-3">
        <CreditCard className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-200 mb-1">Test card (Stripe test mode)</p>
          <p className="text-transit-muted">
            Card: <code className="text-amber-300 bg-transit-dark px-1 rounded">4242 4242 4242 4242</code>
            {" · "}
            Expiry: any future date (e.g. 12/34) · CVC: any 3 digits
          </p>
        </div>
      </div>

      {/* Day ticket & Monthly plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border-2 border-amber-900/50 bg-transit-panel/60 p-6 flex flex-col">
          <Ticket className="w-12 h-12 text-amber-500 mb-4" />
          <h2 className="text-lg font-bold text-gray-100 mb-1">One Time Ticket</h2>
          <p className="text-sm text-transit-muted mb-4">Valid for 1 use only · €5.00</p>
          <button
            onClick={() => openPayment("Day Ticket", "ONETIME")}
            className="mt-auto py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-gray-900 font-medium"
          >
            Buy
          </button>
        </div>

        <div className="rounded-xl border-2 border-amber-900/50 bg-transit-panel/60 p-6 flex flex-col">
          <Ticket className="w-12 h-12 text-amber-500 mb-4" />
          <h2 className="text-lg font-bold text-gray-100 mb-1">Monthly Plan</h2>
          <p className="text-sm text-transit-muted mb-4">Valid for 30 days · €60.00</p>
          <button
            onClick={() => openPayment("Monthly Plan", "MONTHLY")}
            className="mt-auto py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-gray-900 font-medium"
          >
            Buy
          </button>
        </div>
      </div>

      {/* City tickets */}
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-500" />
          City Ticket
        </h2>
        <p className="text-sm text-transit-muted mb-4">Valid for 1 day in the selected city · €4.00</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CITY_OPTIONS.map(({ id, name }) => (
            <div key={id} className="rounded-xl border border-amber-900/40 bg-transit-panel/60 p-4 flex flex-col">
              <span className="font-medium text-gray-200 mb-2">{name}</span>
              <button
                onClick={() => openPayment(`City: ${name}`, "ONETIME", id)}
                className="mt-auto py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-gray-900 font-medium text-sm"
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>

      <StripePaymentModal
        open={modal.open}
        title={modal.title}
        plan={modal.plan}
        city={modal.city}
        token={token}
        onSuccess={handlePaymentSuccess}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Purchase;
