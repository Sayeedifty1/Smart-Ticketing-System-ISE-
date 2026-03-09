/**
 * Dashboard Page
 * --------------
 * Shows user name, nfcId, current plan, active tickets. Button to Purchase.
 * Protected route; requires JWT.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, CreditCard, Ticket, History } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE } from "../config/api.js";

function Dashboard() {
  const { token, user, setToken } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!token) return;
    const ac = new AbortController();
    const opts = { signal: ac.signal, headers: { Authorization: `Bearer ${token}` } };
    Promise.all([
      fetch(`${API_BASE}/api/auth/me`, opts)
        .then((res) => (res.ok ? res.json() : {}))
        .then((data) => data.user && setToken(token, data.user)),
      fetch(`${API_BASE}/api/tickets/me`, opts)
        .then((res) => (res.ok ? res.json() : []))
        .then(setTickets),
    ]).finally(() => setLoading(false)).catch(() => {});
    return () => ac.abort();
  }, [token, setToken]);

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Dashboard</h1>
      <div className="rounded-xl border border-amber-900/40 bg-transit-panel/60 p-6 space-y-6">
        <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-amber-500/80" />
            <div>
              <p className="text-gray-300 font-medium">{user?.name}</p>
              <p className="text-sm text-transit-muted">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500/80" />
            <span className="text-gray-300">NFC ID: <strong className="text-amber-400">{user?.nfcId}</strong></span>
          </div>
          <div>
            <span className="text-transit-muted text-sm">Current plan</span>
            <p className="text-gray-200 font-medium">{user?.currentPlan ?? "NONE"}</p>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-amber-500/90">
                <Ticket className="w-5 h-5" />
                <h2 className="font-semibold text-gray-200">My tickets</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowHistory((v) => !v)}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-amber-700/50 text-amber-400 hover:bg-amber-900/30 text-sm"
              >
                <History className="w-4 h-4" />
                {showHistory ? "Hide" : "Ticket history"}
              </button>
            </div>
            {loading ? (
              <p className="text-sm text-transit-muted">Loading…</p>
            ) : tickets.length === 0 ? (
              <p className="text-sm text-transit-muted">No tickets yet.</p>
            ) : null}
            {/* Ticket list <ul> commented out — uncomment to show list */}
            {!loading && tickets.length > 0 && showHistory && (
              <div className="mt-4 pt-4 border-t border-amber-900/30">
                <p className="text-xs text-transit-muted mb-3">Ticket history — by status</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium text-green-400 mb-2">Unused</p>
                    <ul className="space-y-1.5">
                      {tickets.filter((t) => t.status === "UNUSED").length === 0 ? (
                        <li className="text-sm text-transit-muted">None</li>
                      ) : (
                        tickets.filter((t) => t.status === "UNUSED").map((t) => (
                          <li key={t.id} className="text-sm py-1.5 px-2 rounded bg-transit-dark border border-green-900/30 text-gray-300">
                            {t.city ? `City: ${t.city}` : t.type} · {new Date(t.validUntil).toLocaleDateString()}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-amber-400 mb-2">Used</p>
                    <ul className="space-y-1.5">
                      {tickets.filter((t) => t.status === "USED").length === 0 ? (
                        <li className="text-sm text-transit-muted">None</li>
                      ) : (
                        tickets.filter((t) => t.status === "USED").map((t) => (
                          <li key={t.id} className="text-sm py-1.5 px-2 rounded bg-transit-dark border border-amber-900/30 text-gray-300">
                            {t.city ? `City: ${t.city}` : t.type} · {new Date(t.validUntil).toLocaleDateString()}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-transit-muted mb-2">Expired</p>
                    <ul className="space-y-1.5">
                      {tickets.filter((t) => t.status === "EXPIRED").length === 0 ? (
                        <li className="text-sm text-transit-muted">None</li>
                      ) : (
                        tickets.filter((t) => t.status === "EXPIRED").map((t) => (
                          <li key={t.id} className="text-sm py-1.5 px-2 rounded bg-transit-dark border border-amber-900/30 text-gray-400">
                            {t.city ? `City: ${t.city}` : t.type} · {new Date(t.validUntil).toLocaleDateString()}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/purchase"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-gray-900 font-medium"
            >
              <Ticket className="w-4 h-4" /> Go to Purchase Page
            </Link>
            <Link
              to="/validator"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-lg border border-amber-700/50 text-amber-400 hover:bg-amber-900/30"
            >
              Open Validator Emulator
            </Link>
          </div>
      </div>
    </div>
  );
}

export default Dashboard;
