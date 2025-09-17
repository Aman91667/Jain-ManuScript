import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

// ✅ Import all necessary dashboard components
import ResearcherDashboard from './ResearcherDashboard';
import PendingApproval from './PendingApproval';
import AdminDashboard from './AdminDashboard'; // Assuming you have this component
import UpgradeToResearcherPage from './UpgradeToResearcher'; // The page with the application form

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ✅ 1. RENDER ADMIN DASHBOARD
  // This should be the highest priority check
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // ✅ 2. RENDER PENDING APPROVAL FOR RESEARCHER APPLICATION
  // This covers the case where a user has applied and is waiting for approval
  // We'll use the 'isApproved' flag on the researcher role
  if (user?.role === 'researcher' && !user.isApproved) {
    return <PendingApproval />;
  }
  
  // ✅ 3. RENDER RESEARCHER DASHBOARD FOR APPROVED RESEARCHERS
  // The 'isApproved' flag should be true after admin approval
  if (user?.role === 'researcher' && user.isApproved) {
    return <ResearcherDashboard />;
  }

  // ✅ 4. RENDER APPLICATION PAGE FOR USERS WHO WANT TO UPGRADE
  // This is the correct page for a user who has not applied yet.
  if (user?.role === 'user') {
    return <UpgradeToResearcherPage />;
  }

  // Fallback for any other state (e.g., if a user is not logged in)
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <div className="text-center">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Welcome</h1>
            <p className="text-lg text-muted-foreground mb-4">
                Please log in to continue.
            </p>
            <Button asChild>
                <Link to="/login">Log In</Link>
            </Button>
        </div>
    </div>
  );
};

export default DashboardPage;