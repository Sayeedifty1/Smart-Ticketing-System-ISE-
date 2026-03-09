/**
 * Register Page
 * -------------
 * Name, email, password; creates account and redirects to login (or dashboard if we auto-login).
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import { API_BASE } from "../config/api.js";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      navigate("/login", { replace: true });
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transit-dark justify-center px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="rounded-xl border border-amber-900/40 bg-transit-panel/80 p-8">
          <div className="flex items-center gap-2 text-amber-500 mb-6">
            <UserPlus className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-gray-100">Register</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-transit-muted mb-1">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-transit-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-transit-dark border border-amber-900/40 text-gray-200"
                  placeholder="Your name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-transit-muted mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-transit-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-transit-dark border border-amber-900/40 text-gray-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-transit-muted mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-transit-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-transit-dark border border-amber-900/40 text-gray-200"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-gray-900 font-medium disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className="mt-4 text-sm text-transit-muted text-center">
            Already have an account? <Link to="/login" className="text-amber-500 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
