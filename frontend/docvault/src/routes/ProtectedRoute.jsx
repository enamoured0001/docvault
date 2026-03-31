import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authservices";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#dbeafe,#f8fafc_45%,#eef2ff_100%)] px-4">
        <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-white/85 p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#2563eb,#0f172a)] text-2xl font-bold text-white shadow-lg shadow-blue-200">
            D
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">Preparing your workspace</h2>
          <p className="mt-2 text-sm text-slate-500">
            Verifying your documents and account access.
          </p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
