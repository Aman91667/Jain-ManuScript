// UpgradeToResearcherPage.tsx
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import { authService } from '@/services/authService';

const UpgradeToResearcherPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [researchDescription, setResearchDescription] = useState('');
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdProofFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!phoneNumber || !researchDescription || !idProofFile) {
      toast({ title: "Validation Error", description: "Please fill in all fields and upload your ID proof.", variant: "destructive" });
      return;
    }

    if (!agreeToTerms) {
      toast({ title: "Terms Required", description: "Please agree to the Terms & Conditions.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.applyForResearcherStatus({ phoneNumber, researchDescription, idProofFile, agreeToTerms });

      toast({
        title: "Application Submitted!",
        description: response.message || "Your request is awaiting admin approval.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({ title: "Application Failed", description: error.response?.data?.message || error.message || "Unable to submit application.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 mb-2 w-fit">
            <UserPlus className="h-8 w-8" />
          </div>
          <CardTitle className="font-serif text-3xl">Upgrade to Researcher</CardTitle>
          <CardDescription className="mt-2 text-sm">
            Submit your application to become part of our research community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <p className="text-sm text-muted-foreground">{user?.name}</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+91 9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="researchDescription">Research Description</Label>
              <Textarea
                id="researchDescription"
                name="researchDescription"
                placeholder="Briefly describe your area of research."
                value={researchDescription}
                onChange={(e) => setResearchDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idProof">ID Proof (e.g., University ID)</Label>
              <Input
                id="idProof"
                name="idProof"
                type="file"
                onChange={handleFileChange}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:text-primary/80">
                  Terms & Conditions
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpgradeToResearcherPage;
