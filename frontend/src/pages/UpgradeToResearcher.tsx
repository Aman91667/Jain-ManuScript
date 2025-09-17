// UpgradeToResearcherPage.tsx
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { authService, ApplyForResearcherCredentials } from '@/services/authService';

const UpgradeToResearcherPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ApplyForResearcherCredentials>({
    phoneNumber: '',
    researchDescription: '',
    idProofFile: null as any,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ CORRECTED: Safely handle the 'files' property
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const file = e.target.files?.[0] || null;
      setFormData(prevData => ({
        ...prevData,
        [name]: file,
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.phoneNumber || !formData.researchDescription || !formData.idProofFile) {
      toast({ 
        title: "Validation Error", 
        description: "Please fill in all fields and upload your ID proof.", 
        variant: "destructive" 
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await authService.applyForResearcherStatus(formData);

      toast({
        title: "Application Submitted!",
        description: response.message || "Your request is awaiting admin approval.",
      });
      
      navigate('/dashboard'); 

    } catch (error: any) {
      toast({
        title: "Application Failed",
        description: error.message || "Unable to submit application. Please try again.",
        variant: "destructive",
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
          <CardTitle className="font-serif text-3xl">
            Upgrade to Researcher
          </CardTitle>
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
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="researchDescription">Research Description</Label>
              <Textarea
                id="researchDescription"
                name="researchDescription"
                placeholder="Briefly describe your area of research."
                value={formData.researchDescription}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idProof">ID Proof (e.g., University ID)</Label>
              <Input
                id="idProof"
                name="idProofFile"
                type="file"
                onChange={handleChange}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
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