/**
 * Virtual NFC Reader
 * ------------------
 * Simulates NFC tap: dropdown of users (user1, user2, …) sends { nfcId } to validate.
 * Optional manual ticket ID input still sends { ticketId } for backward compatibility.
 *
 * ⚠️ CHANGE THIS if backend runs on a different port:
 *    Update API_BASE in src/config/api.js (or use env vars in production).
 */

import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { API_BASE } from "../config/api.js";

/**
 * @param {({ result, reason }) => void} [props.onValidate] - Callback after validation.
 */
function VirtualNFCReader({ onValidate }) {
  const [nfcIds, setNfcIds] = useState([]);
  const [selectedNfcId, setSelectedNfcId] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch list of nfcIds (user1, user2, …) for dropdown — simulates which cards exist.
  useEffect(() => {
    fetch(`${API_BASE}/api/nfc-ids`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setNfcIds)
      .catch(() => setNfcIds([]));
  }, []);

  const validate = async (payload) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      const result = data.result ?? "DENY";
      const reason = data.reason ?? "Error";
      onValidate?.({ result, reason });
    } catch (e) {
      setError(e.message || "Request failed");
      onValidate?.({ result: "DENY", reason: "Request failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleNfcTap = (e) => {
    e.preventDefault();
    if (selectedNfcId) validate({ nfcId: selectedNfcId });
  };

  const handleTicketIdSubmit = (e) => {
    e.preventDefault();
    if (ticketId.trim()) validate({ ticketId: ticketId.trim() });
  };

  return (
    <div className="rounded-xl border border-amber-900/40 bg-transit-panel/60 p-6 flex flex-col">
      <p className="text-xs text-transit-muted mb-4">
        Simulate tapping an NFC card by selecting a user and validating.
      </p>

      <form onSubmit={handleNfcTap} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Select user (NFC tap)</label>
          <select
            value={selectedNfcId}
            onChange={(e) => setSelectedNfcId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-transit-dark border border-amber-900/40 text-gray-200"
          >
            <option value="">— Select —</option>
            {nfcIds.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading || !selectedNfcId}
          className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-gray-900 font-medium flex items-center justify-center gap-2"
        >
          <Ticket className="w-4 h-4" aria-hidden />
          {loading ? "Validating…" : "Validate (tap)"}
        </button>
      </form>

      <div className="mt-4 pt-4 border-t border-amber-900/30">
        <p className="text-xs text-transit-muted mb-2">Or enter Ticket ID manually</p>
        <form onSubmit={handleTicketIdSubmit} className="flex gap-2">
        <input
          type="text"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          placeholder="Ticket ID"
          className="flex-1 px-3 py-2 rounded-lg bg-transit-dark border border-amber-900/40 text-gray-200 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={loading || !ticketId.trim()}
          className="py-2 px-3 rounded-lg bg-transit-panel border border-amber-900/40 text-gray-300 hover:bg-amber-900/30 disabled:opacity-50 text-sm"
        >
          Validate
        </button>
      </form>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default VirtualNFCReader;
