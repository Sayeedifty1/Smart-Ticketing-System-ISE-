/**
 * Protected Route
 * ---------------
 * If there is no JWT, redirect to /login. Dashboard and purchase require
 * login so only authenticated users can access them. In production, validate
 * the token with the server or use httpOnly cookies for the token.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export default ProtectedRoute;
