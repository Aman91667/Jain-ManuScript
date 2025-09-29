import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'researcher';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle researchers explicitly
  if (user?.role === 'researcher') {
    if (user.status === 'rejected') {
      return (
        <Navigate
          to="/dashboard"
          replace
          state={{ rejectionReason: user.rejectionReason }}
        />
      );
    }

    if (!user.isApproved) {
      return <Navigate to="/pending-approval" replace />;
    }
  }

  // Role check for other routes
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
