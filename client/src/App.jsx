/**
 * App Root — Transit Ticketing
 * ----------------------------
 * Layout (navbar + outlet) wraps all pages. Landing at /; Login/Register in nav when logged out;
 * Dashboard, Purchase, Validator, Logout in nav when logged in.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Purchase from "./pages/Purchase.jsx";
import Validator from "./pages/Validator.jsx";

function AppRoutes() {
  const { token, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/purchase" element={<ProtectedRoute><Purchase /></ProtectedRoute>} />
        <Route path="/validator" element={<ProtectedRoute><Validator /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
