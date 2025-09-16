import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Upload, Plus } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Mock data for pending researcher applications
  const pendingResearchers = [
    { id: 'app1', name: 'Dr. Jane Smith', email: 'jane@example.com', description: 'Interested in early Jain philosophical texts.', date: '2 days ago' },
    { id: 'app2', name: 'Dr. Alex Chen', email: 'alex@example.com', description: 'Working on Jain art and iconography.', date: '1 day ago' },
  ];

  const handleApprove = (id: string) => {
    console.log(`Approving researcher with ID: ${id}`);
    // This would be an API call to the backend
  };

  const handleReject = (id: string) => {
    console.log(`Rejecting researcher with ID: ${id}`);
    // This would be an API call to the backend
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome, {user?.name}. Manage the platform's content and users.
          </p>
        </div>

        {/* Pending Researcher Applications */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-xl">Pending Researcher Applications</CardTitle>
              <CardDescription>Review and approve new research applicants.</CardDescription>
            </div>
            <Badge variant="secondary">{pendingResearchers.length} Pending</Badge>
          </CardHeader>
          <CardContent>
            {pendingResearchers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingResearchers.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.name}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleApprove(app.id)} className="text-green-600 hover:text-green-800">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleReject(app.id)} className="text-red-600 hover:text-red-800">
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center">No new applications at this time.</p>
            )}
          </CardContent>
        </Card>
        
        {/* New Content Upload Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-xl">Upload New Manuscripts</CardTitle>
              <CardDescription>Add new manuscripts to the collection.</CardDescription>
            </div>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Manuscript
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;