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
    // Show loading state while authentication status is determined
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" replace />;
  }

  // --- Role and Approval Check ---

  if (requiredRole) {
    // 1. Check if the user has the required role
    if (user?.role !== requiredRole) {
      // If the role doesn't match, send them to their dashboard
      return <Navigate to="/dashboard" replace />;
    }

    // 2. Special Check for Approved Researcher Routes
    if (requiredRole === 'researcher') {
      // Only allow access if the role is 'researcher' AND they are approved (status === 'approved')
      if (!user?.isApproved) {
        // If not approved (pending/rejected), send them to the general dashboard 
        // where the logic will route them to PendingApproval or Upgrade page.
        return <Navigate to="/dashboard" replace />;
      }
    }

    // NOTE: Admin access is implicitly covered by the role check (Step 1), 
    // as there's no secondary approval step for admins.
  }

  // If all checks pass, render the protected component
  return <>{children}</>;
};

export default PrivateRoute;