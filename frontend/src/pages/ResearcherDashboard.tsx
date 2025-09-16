// frontend/src/pages/ResearcherDashboard.tsx

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, FileText, User, Mail, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import HelpForm from '@/components/common/HelpForm';

const ResearcherDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const approvedManuscripts = user?.approvedManuscripts || [
    { id: '60c72b2f9b1d8c001f8e4e9a', title: 'Kalpa Sutra', access: 'full' },
    { id: '60c72b2f9b1d8c001f8e4e9b', title: 'Tattvartha Sutra', access: 'full' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            Researcher Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome, {user?.name}. Your research journey awaits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved Access</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedManuscripts.length} Manuscripts</div>
              <p className="text-xs text-muted-foreground mt-1">
                You have full study access to these documents.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{user?.role}</div>
              <p className="text-xs text-muted-foreground mt-1">
                You can add annotations and submit new manuscripts.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-1">
                Manuscripts awaiting administrator review.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Approved Manuscripts Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-xl">My Approved Manuscripts</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/request-access">
                <Plus className="h-4 w-4 mr-2" />
                Request New Access
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {approvedManuscripts.length > 0 ? (
              <ul className="space-y-2">
                {approvedManuscripts.map((manuscript) => (
                  <li key={manuscript.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">{manuscript.title}</span>
                    <Badge>{manuscript.access}</Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/manuscript/${manuscript.id}`}>
                        View <Book className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                You currently have no approved manuscripts.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Help Form Button */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-xl">Need Assistance?</CardTitle>
            <HelpForm 
              trigger={
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Admin
                </Button>
              }
            />
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default ResearcherDashboard;