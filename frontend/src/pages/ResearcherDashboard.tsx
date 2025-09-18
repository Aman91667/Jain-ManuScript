import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Book, User, Mail, FileText, Search, TrendingUp, CircleCheck, Clock } from 'lucide-react';
import HelpForm from '../components/common/HelpForm';
import { Separator } from '../components/ui/separator';

const ResearcherDashboard: React.FC = () => {
  const navigate = useNavigate();
  // State to control if the "Browse" button is disabled
  const [isBrowseLoading, setIsBrowseLoading] = useState(false);

  const { user } = useAuth() || {
    user: {
      name: 'Dr. Evelyn Reed',
      role: 'principal researcher',
      approvedManuscripts: [{ id: 1 }, { id: 2 }],
      pendingSubmissions: [{ id: 3 }],
      recentHighlights: [
        'Collaborated on the "AI in Medicine" project.',
        'Published "Nanotechnology in Materials Science" in Nature.',
        'Received grant approval for the "Future of Quantum Computing" study.'
      ]
    }
  };

  // Function to handle the navigation
  const handleBrowseClick = () => {
    setIsBrowseLoading(true);
    // Simulate a brief loading period before navigating
    setTimeout(() => {
      navigate('/browse');
      setIsBrowseLoading(false);
    }, 500); // 500ms delay to simulate loading
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        {/* Header with Centered Welcome Message */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
           Jai Jinandra, <span className="text-primary">{user?.name}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
           आपके सहयोग के लिए धन्यवाद्
          </p>
        </div>
        <Separator className="mb-8" />

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Your Role */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
              <User className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold capitalize">{user?.role || 'Researcher'}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Full permissions for annotations, submissions, and collaborative research.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Research Access */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Research Access</CardTitle>
              <CircleCheck className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground mt-1">
                You have full access to approved manuscripts and research materials.
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Approved Manuscripts */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Manuscripts</CardTitle>
              <Book className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {user?.approvedManuscripts?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Documents available for study
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Research Highlights Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump right into your workflow with these shortcuts.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleBrowseClick}
                disabled={isBrowseLoading} // Disable the button while loading
              >
                {isBrowseLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Browse All Manuscripts
              </Button>
              <HelpForm
                trigger={
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                }
              />
            </CardContent>
          </Card>

          {/* Research Highlights Card */}
          <Card>
            <CardHeader>
              <CardTitle>Research Highlights</CardTitle>
              <CardDescription>
                Notable achievements and milestones in your research.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {user?.recentHighlights?.length > 0 ? (
                  user.recentHighlights.map((highlight, index) => (
                    <li key={index} className="text-sm text-foreground">
                      {highlight}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent highlights to display.</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResearcherDashboard;