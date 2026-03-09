/**
 * Login Page
 * ----------
 * Email + password; on success save JWT in localStorage (via AuthContext) and redirect to dashboard.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE } from "../config/api.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      setToken(data.token, data.user);
      navigate("/dashboard", { replace: true });
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
            <LogIn className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-gray-100">Login</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-4 text-sm text-transit-muted text-center">
            Don’t have an account? <Link to="/register" className="text-amber-500 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
