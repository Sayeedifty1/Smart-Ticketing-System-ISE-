/**
 * Auth Context
 * ------------
 * Holds JWT and user state. Token is stored in localStorage so the user stays
 * "logged in" across refreshes. Routes are protected by checking for this token.
 * In production, use httpOnly cookies instead so the token is not readable by JS (XSS-safe).
 */

import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE } from "../config/api.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "transit_token";
const USER_KEY = "transit_user";

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (stored) setTokenState(stored);
    if (storedUser) try { setUser(JSON.parse(storedUser)); } catch {}
    setLoading(false);
  }, []);

  const setToken = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setTokenState(null);
    }
    if (newUser !== undefined) {
      if (newUser) localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      else localStorage.removeItem(USER_KEY);
      setUser(newUser);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { API_BASE };
