import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

// Import all specific dashboard components
import ResearcherDashboard from './ResearcherDashboard'; 
import PendingApproval from './PendingApproval'; 
import AdminDashboard from './AdminDashboard'; 
import UpgradeToResearcherPage from './UpgradeToResearcher'; 

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
                        <p className="text-muted-foreground mb-4">
                            Please log in to continue.
                        </p>
                        <Button asChild>
                            <Link to="/login">Log In</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 1. Admin Dashboard (Highest access level)
    if (user.role === 'admin') {
        return <AdminDashboard />;
    }

    // 2. Researcher Workflow Management
    if (user.role === 'researcher') {
        switch (user.status) {
            case 'approved':
                // ✅ Approved: Go to Researcher Dashboard
                return <ResearcherDashboard />;
            case 'pending':
                // Pending: Show pending status page
                return <PendingApproval />;
            case 'rejected':
                // Rejected: Go back to the Upgrade page, showing the rejection reason
                // Assuming UpgradeToResearcherPage accepts rejectionReason as a prop or fetches it.
                return <UpgradeToResearcherPage rejectionReason={user.rejectionReason} />;
            default:
                // Fallback to the main researcher view if role is researcher but status is unexpected
                return <ResearcherDashboard />;
        }
    }

    // 3. Normal User (Default 'user' role)
    // If the role is 'user', they should be prompted to upgrade/apply.
    if (user.role === 'user') {
        return <UpgradeToResearcherPage />;
    }

    return null;
};

export default DashboardPage;