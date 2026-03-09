/**
 * Landing Page
 * ------------
 * Home page with hero and CTAs. Navbar (Login/Register or Dashboard, etc.) is in the layout.
 */

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Train, Ticket, ArrowRight } from "lucide-react";

function Landing() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-transit-dark">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 text-amber-500 mb-6">
            <Train className="w-16 h-16" aria-hidden />
          </div>
          <h1 className="text-4xl font-bold text-gray-100 tracking-tight mb-4">
            Transit Ticketing
          </h1>
          <p className="text-lg text-transit-muted mb-8">
            Buy tickets, validate at the gate, and manage your travel in one place.
          </p>
          {token ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-gray-900 font-semibold"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-gray-900 font-semibold"
              >
                Login <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-amber-600/60 text-amber-400 hover:bg-amber-900/30 font-semibold"
              >
                <Ticket className="w-5 h-5" /> Create account
              </Link>
            </div>
          )}
        </div>
      </main>
      <footer className="border-t border-amber-900/30 py-4 text-center text-xs text-transit-muted">
        Transit Ticketing Prototype
      </footer>
    </div>
  );
}

export default Landing;
