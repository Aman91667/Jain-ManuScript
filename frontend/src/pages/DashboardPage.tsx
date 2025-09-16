import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResearcherDashboard from './ResearcherDashboard';
import PendingApproval from './PendingApproval';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user?.role === 'researcher') {
    return <ResearcherDashboard />;
  }

  if (user?.role === 'user' && !user.isApproved) {
    return <PendingApproval />;
  }

  // Default dashboard for a standard user
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            User Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome, {user?.name}. Your journey begins here.
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Browse & Discover</CardTitle>
            <CardDescription>
              Explore our public collection of Jain manuscripts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="hero">
              <Link to="/browse">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Manuscripts
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Become a Researcher</CardTitle>
            <CardDescription>
              Apply for full access to our research tools and manuscript collections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/apply-researcher">
                <User className="mr-2 h-4 w-4" />
                Apply for Researcher Status
              </Link>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default DashboardPage;