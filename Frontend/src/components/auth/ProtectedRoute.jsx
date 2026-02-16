import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. Loading State: Wait for AuthContext to check localStorage/Backend
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-surface)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[var(--color-darkblue-600)] animate-spin" />
          <p className="text-sm font-bold text-[var(--color-darkblue-400)] uppercase tracking-widest">
            Verifying Access...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Redirect to Login
  // We pass 'state' so we can redirect them back to the dashboard after they login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated: Render the Admin Dashboard (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;