// src/pages/UpgradeToResearcher.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { authService } from '@/services/authService';

interface UpgradeToResearcherPageProps {
  rejectionReason?: string;
}

const UpgradeToResearcherPage: React.FC<UpgradeToResearcherPageProps> = ({ rejectionReason }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const [phoneNumber, setPhoneNumber] = useState<string>(user.phoneNumber || '');
  const [researchDescription, setResearchDescription] = useState<string>(user.researchDescription || '');
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setIdProofFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!phoneNumber || !researchDescription || !idProofFile) {
      toast({
        title: 'Validation Error',
        description: 'All fields are required and ID proof must be uploaded.',
        variant: 'destructive',
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please agree to the Terms & Conditions.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.applyForResearcherStatus({
        phoneNumber,
        researchDescription,
        idProofFile,
        agreeToTerms: true,
      });

      // Update context with latest user info including new status
      setUser(response.user);

      toast({
        title: 'Application Submitted',
        description: response.message || 'Your application is now pending admin approval.',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Application Failed',
        description: error.response?.data?.message || error.message || 'Unable to submit application.',
        variant: 'destructive',
      });
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
            Submit your application to join our research community.
          </CardDescription>

          {/* Show rejection reason only if status is 'rejected' */}
          {user.status === 'rejected' && rejectionReason && (
            <p className="text-red-500 text-sm mt-2">
              Your previous application was rejected: {rejectionReason}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Email */}
            <div className="space-y-2">
              <Label>Full Name</Label>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 9876543210"
                required
              />
            </div>

            {/* Research Description */}
            <div className="space-y-2">
              <Label htmlFor="researchDescription">Research Description</Label>
              <Textarea
                id="researchDescription"
                value={researchDescription}
                onChange={(e) => setResearchDescription(e.target.value)}
                placeholder="Briefly describe your research."
                required
              />
            </div>

            {/* ID Proof */}
            <div className="space-y-2">
              <Label htmlFor="idProof">ID Proof</Label>
              <Input id="idProof" type="file" onChange={handleFileChange} required />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked: boolean | 'indeterminate') =>
                  setAgreeToTerms(Boolean(checked))
                }
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                I agree to the{' '}
                <a href="/terms" className="text-primary hover:text-primary/80">
                  Terms & Conditions
                </a>
              </Label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
