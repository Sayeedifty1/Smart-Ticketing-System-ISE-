/**
 * Live Audit Feed
 * ---------------
 * Polls the backend every 2 seconds and displays recent audit log entries
 * (timestamp, result, reason). Uses fetch (no axios).
 *
 * For production: consider using env for API base URL and securing the
 * audit endpoint (auth, rate limit).
 */

import { useEffect, useState } from "react";
import { ScrollText } from "lucide-react";
import { API_BASE } from "../config/api.js";

function LiveAuditFeed() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = () => {
      fetch(`${API_BASE}/api/audit-logs`)
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to fetch"))))
        .then((data) => {
          setLogs(Array.isArray(data) ? data : []);
          setError(null);
        })
        .catch((e) => setError(e.message));
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ts) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return String(ts);
    }
  };

  const grantCount = logs.filter((e) => e.result === "GRANT").length;
  const denyCount = logs.filter((e) => e.result === "DENY").length;

  return (
    <div className="rounded-xl border border-amber-900/40 bg-transit-panel/60 p-6 flex flex-col min-h-[280px]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-transit-muted">Updates every 2s</p>
        {logs.length > 0 && (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-green-400">{grantCount} GRANT</span>
            <span className="text-red-400">{denyCount} DENY</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[200px] max-h-[340px] overflow-y-auto space-y-2 pr-1">
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        {logs.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ScrollText className="w-10 h-10 text-transit-muted/50 mb-2" />
            <p className="text-sm text-transit-muted">No audit entries yet.</p>
            <p className="text-xs text-transit-muted mt-1">Validate a ticket to see entries here.</p>
          </div>
        )}
        {logs.map((entry, i) => (
          <div
            key={i}
            className={`
              flex items-center gap-3 py-2.5 px-3 rounded-lg border text-sm
              ${entry.result === "GRANT"
                ? "border-green-800/50 bg-green-950/20 text-green-300"
                : "border-red-900/50 bg-red-950/20 text-red-300"
              }
            `}
          >
            <span className="text-transit-muted shrink-0 tabular-nums">{formatTime(entry.timestamp)}</span>
            <span className="font-semibold shrink-0 w-14">{entry.result}</span>
            <span className="truncate">{entry.reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveAuditFeed;
