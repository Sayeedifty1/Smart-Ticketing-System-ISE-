/**
 * Smart Gate Component
 * --------------------
 * Visual gate state for the validator emulator.
 * Default: red Lock. On GRANT: green Unlock + "Gate Open" animation, then auto-reset after 3s.
 */

import { useEffect, useState } from "react";
import { Lock, Unlock } from "lucide-react";

const RESET_SECONDS = 3;

function SmartGate({ gateOpen, onReset }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (!gateOpen) {
      setIsAnimating(false);
      setCountdown(null);
      return;
    }
    setIsAnimating(true);
    let remaining = RESET_SECONDS;
    setCountdown(remaining);
    const tick = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) clearInterval(tick);
    }, 1000);
    const resetTimer = setTimeout(() => onReset?.(), RESET_SECONDS * 1000);
    return () => {
      clearTimeout(resetTimer);
      clearInterval(tick);
    };
  }, [gateOpen, onReset]);

  const open = gateOpen && isAnimating;

  return (
    <div
      className={`
        rounded-xl border-2 p-6 flex flex-col items-center justify-center gap-4 min-h-[220px]
        transition-all duration-300
        ${open
          ? "border-green-500/60 bg-green-950/30 shadow-lg shadow-green-900/20"
          : "border-red-900/60 bg-red-950/20"
        }
      `}
    >
      <div
        className={`
          transition-transform duration-300
          ${open ? "scale-110 animate-pulse" : "scale-100"}
        `}
        aria-hidden
      >
        {open ? (
          <Unlock className="w-20 h-20 text-green-500" strokeWidth={1.5} />
        ) : (
          <Lock className="w-20 h-20 text-red-500" strokeWidth={1.5} />
        )}
      </div>
      <span
        className={`
          font-semibold text-lg transition-colors duration-300
          ${open ? "text-green-400" : "text-red-400"}
        `}
      >
        {open ? "Gate Open" : "Gate Closed"}
      </span>
      {open && countdown !== null && countdown > 0 && (
        <p className="text-xs text-green-400/80">
          Closing in {countdown}s
        </p>
      )}
    </div>
  );
}

export default SmartGate;
