import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

import ResearcherDashboard from './ResearcherDashboard';
import PendingApproval from './PendingApproval';
import AdminDashboard from './AdminDashboard';
import UpgradeToResearcher from './UpgradeToResearcher';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <Card className="p-6 text-center">
          <CardContent>
            <h1 className="font-serif text-3xl mb-2">Welcome</h1>
            <p className="text-muted-foreground mb-4">Please log in to continue.</p>
            <Button asChild>
              <Link to="/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  if (user.role === 'admin') return <AdminDashboard />;

  // Researcher Rejected → show rejection info on dashboard instead of redirect
  if (user.role === 'researcher' && user.rejected) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-6 text-center">
          <CardContent>
            <h1 className="text-2xl font-semibold mb-4">Application Rejected</h1>
            <p className="text-red-500 mb-4">
              Reason: {user.rejectionReason || 'No reason provided'}
            </p>
            <Button asChild>
              <Link to="/upgrade-to-researcher">Re-Apply</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Researcher Pending Approval
  if (user.role === 'researcher' && !user.isApproved && !user.rejected) {
    return <PendingApproval />;
  }

  // Researcher Approved
  if (user.role === 'researcher' && user.isApproved) return <ResearcherDashboard />;

  // Normal user → show upgrade page
  if (user.role === 'user') return <UpgradeToResearcher />;

  return null;
};

export default DashboardPage;
