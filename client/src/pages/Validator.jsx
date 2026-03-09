/**
 * Validator Emulator Page
 * -----------------------
 * Simulates a transit gate: Smart Gate, Virtual NFC Reader, Live Audit Feed.
 * Furnished with instructions, last-result banner, and clear section layout.
 */

import { useState, useCallback } from "react";
import {
  Scan,
  DoorOpen,
  Smartphone,
  ScrollText,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import SmartGate from "../components/SmartGate.jsx";
import VirtualNFCReader from "../components/VirtualNFCReader.jsx";
import LiveAuditFeed from "../components/LiveAuditFeed.jsx";

function Validator() {
  const [gateOpen, setGateOpen] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleValidate = useCallback(({ result, reason }) => {
    setLastResult({ result, reason });
    if (result === "GRANT") setGateOpen(true);
  }, []);

  const handleGateReset = useCallback(() => setGateOpen(false), []);

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
          <Scan className="w-8 h-8" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
            Validator Emulator
          </h1>
          <p className="text-sm text-transit-muted">
            Simulate NFC tap and gate response
          </p>
        </div>
      </div>

      {/* Last validation result banner */}
      {lastResult && (
        <div
          className={`
            mb-6 rounded-xl border px-4 py-3 flex items-center gap-3
            ${lastResult.result === "GRANT"
              ? "border-green-700/50 bg-green-950/30"
              : "border-red-900/50 bg-red-950/30"
            }
          `}
        >
          {lastResult.result === "GRANT" ? (
            <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500 shrink-0" />
          )}
          <div className="min-w-0">
            <span className="font-semibold text-gray-100">
              Last result: {lastResult.result}
            </span>
            <span className="text-transit-muted ml-2">— {lastResult.reason}</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-6 rounded-xl border border-amber-900/40 bg-transit-panel/40 p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-500/90 shrink-0 mt-0.5" />
        <div className="text-sm text-gray-300">
          <p className="font-medium text-gray-200 mb-1">How to use</p>
          <p>
            Select a user (NFC card) in the reader and tap <strong>Validate</strong>.
            The gate opens on <strong>GRANT</strong> and auto-closes after 3 seconds.
            All attempts appear in the Live Audit Feed.
          </p>
        </div>
      </div>

      {/* Main grid: Gate | Reader | Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1">
          <div className="flex items-center gap-2 text-amber-500/90 mb-3">
            <DoorOpen className="w-5 h-5" aria-hidden />
            <h2 className="font-semibold text-gray-200">Smart Gate</h2>
          </div>
          <SmartGate gateOpen={gateOpen} onReset={handleGateReset} />
        </section>

        <section className="lg:col-span-1">
          <div className="flex items-center gap-2 text-amber-500/90 mb-3">
            <Smartphone className="w-5 h-5" aria-hidden />
            <h2 className="font-semibold text-gray-200">Virtual NFC Reader</h2>
          </div>
          <VirtualNFCReader onValidate={handleValidate} />
        </section>

        <section className="lg:col-span-1">
          <div className="flex items-center gap-2 text-amber-500/90 mb-3">
            <ScrollText className="w-5 h-5" aria-hidden />
            <h2 className="font-semibold text-gray-200">Live Audit Feed</h2>
          </div>
          <LiveAuditFeed />
        </section>
      </div>
    </div>
  );
}

export default Validator;
