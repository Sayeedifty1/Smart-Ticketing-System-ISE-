/**
 * Navbar
 * ------
 * Shared nav: logo → landing; when logged out show Login, Register;
 * when logged in show Dashboard, Purchase, Validator, Logout.
 */

import { Link, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import { Train, LogIn, UserPlus, LayoutDashboard, Ticket, Scan, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    flushSync(() => logout());
    navigate("/", { replace: true });
  };

  return (
    <nav className="border-b border-amber-900/50 bg-transit-panel/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-gray-100 hover:text-amber-400 transition-colors">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
            <Train className="w-6 h-6" aria-hidden />
          </div>
          <span className="font-bold tracking-tight">Transit Ticketing</span>
        </Link>

        <div className="flex items-center gap-1">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:bg-amber-900/30 hover:text-amber-400 text-sm"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link
                to="/purchase"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:bg-amber-900/30 hover:text-amber-400 text-sm"
              >
                <Ticket className="w-4 h-4" /> Purchase
              </Link>
              <Link
                to="/validator"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:bg-amber-900/30 hover:text-amber-400 text-sm"
              >
                <Scan className="w-4 h-4" /> Validator
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-900/30 hover:text-red-400 text-sm"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:bg-amber-900/30 hover:text-amber-400 text-sm"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-gray-900 font-medium text-sm"
              >
                <UserPlus className="w-4 h-4" /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
