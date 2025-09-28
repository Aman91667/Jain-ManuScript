import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, Upload, File } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { authService, User } from '@/services/authService';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingResearchers, setPendingResearchers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPending = async () => {
    setIsLoading(true);
    try {
      const applications = await authService.fetchPendingApplications();
      setPendingResearchers(applications);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      setPendingResearchers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (_id: string) => {
    try {
      await authService.approveResearcher(_id);
      toast({ title: 'Success!', description: 'Researcher approved.' });
      fetchPending();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleReject = async (_id: string) => {
    try {
      await authService.rejectResearcher(_id);
      toast({ title: 'Rejected!', description: 'Researcher rejected.' });
      fetchPending();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  if (isLoading && pendingResearchers.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground text-lg mb-6">Manage platform content and users.</p>

        <Card className="mb-8">
          <CardHeader className="flex justify-between items-center">
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
                    <TableHead>Phone</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>ID Proof</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingResearchers.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.phoneNumber}</TableCell>
                      <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{r.researchDescription}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <File className="h-4 w-4 mr-2" /> View File
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>ID Proof</DialogTitle>
                              <DialogDescription>View the uploaded ID proof.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              {r.idProofUrl ? (
                                <img src={`http://localhost:4000/${r.idProofUrl}`} alt="ID Proof" className="max-w-full h-auto" />
                              ) : (
                                <p>No ID Proof uploaded.</p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleApprove(r._id)} className="text-green-600 hover:text-green-800">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleReject(r._id)} className="text-red-600 hover:text-red-800">
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

        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className="font-serif text-xl">Upload New Manuscripts</CardTitle>
              <CardDescription>Add new manuscripts to the collection.</CardDescription>
            </div>
            <Button onClick={() => navigate('/admin/upload-manuscript')}>
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
