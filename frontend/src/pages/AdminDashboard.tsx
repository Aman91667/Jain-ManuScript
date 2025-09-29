import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, Upload, File } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { authService, User } from '@/services/authService';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingResearchers, setPendingResearchers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedResearcher, setSelectedResearcher] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch pending researcher applications
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

  // Approve researcher
  const handleApprove = async (_id: string) => {
    try {
      const response = await authService.approveResearcher(_id);
      toast({ title: 'Success!', description: response.message });
      setPendingResearchers(prev => prev.filter(r => r._id !== _id));
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  // Open reject modal
  const openRejectModal = (researcher: User) => {
    setSelectedResearcher(researcher);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  // Confirm rejection
  const handleReject = async () => {
    if (!selectedResearcher) return;
    if (!rejectionReason.trim()) {
      toast({ title: 'Error', description: 'Please provide a rejection reason.', variant: 'destructive' });
      return;
    }
    try {
      const response = await authService.rejectResearcher(selectedResearcher._id, rejectionReason);
      toast({ title: 'Rejected!', description: response.message });
      setPendingResearchers(prev => prev.filter(r => r._id !== selectedResearcher._id));
      setRejectDialogOpen(false);
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
                        <Button variant="ghost" size="sm" onClick={() => handleApprove(r._id)} className="text-green-600 hover:text-green-800 mr-2">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openRejectModal(r)} className="text-red-600 hover:text-red-800">
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

        {/* Reject Modal */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Reject Researcher</DialogTitle>
              <DialogDescription>Provide a reason for rejecting this application.</DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-4"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject}>Reject</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
