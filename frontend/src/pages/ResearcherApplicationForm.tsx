// src/components/ResearcherApplicationForm.tsx

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { researcherService, UpgradeCredentials } from '@/services/researcherService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

const ResearcherApplicationForm: React.FC = () => {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [researchDescription, setResearchDescription] = useState('');
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !researchDescription || !idProofFile) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields and upload a file.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const credentials: UpgradeCredentials = {
      phoneNumber,
      researchDescription,
      idProofFile,
    };

    try {
      await researcherService.applyForResearcherStatus(credentials);
      toast({
        title: 'Application Submitted',
        description: 'Your application has been submitted for review. You will be notified of its status.',
      });
      navigate('/dashboard'); // Navigate back to the dashboard
    } catch (error: any) {
      toast({
        title: 'Application Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role === 'researcher' || user?.role === 'admin') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Already a Researcher</CardTitle>
            <CardDescription>
              You are already a registered researcher.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Become a Researcher</CardTitle>
          <CardDescription>
            Submit your credentials to apply for researcher status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="researchDescription">Research Description</Label>
              <Textarea
                id="researchDescription"
                value={researchDescription}
                onChange={(e) => setResearchDescription(e.target.value)}
                placeholder="Describe your research background and interests."
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idProof">ID Proof</Label>
              <Input
                id="idProof"
                type="file"
                onChange={(e) => setIdProofFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearcherApplicationForm;