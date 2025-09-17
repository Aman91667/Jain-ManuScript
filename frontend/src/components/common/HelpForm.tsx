// src/components/common/HelpForm.tsx

import React, { useState, ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { researcherService, HelpRequestPayload } from '@/services/researcherService';

interface HelpFormProps {
  manuscriptId?: string;
  trigger: React.ReactElement; // Ensures it must be a single element
}

const HelpForm: React.FC<HelpFormProps> = ({ manuscriptId, trigger }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({ 
        title: "Message required", 
        description: "Please enter your message.", 
        variant: "destructive" 
      });
      return;
    }
    setIsLoading(true);
    try {
      const payload: HelpRequestPayload = {
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email,
        manuscriptId,
        message,
      };
      await researcherService.submitHelpRequest(payload);
      toast({ title: "Success!", description: "Your help request has been sent to the admin." });
      setMessage('');
      setIsOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to send request. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Administrator</DialogTitle>
          <DialogDescription>
            Submit a help request related to your research or a specific manuscript.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="researcher-name">Your Name</Label>
            <p id="researcher-name" className="text-sm text-muted-foreground">{user?.name}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Describe your problem or question here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Sending..." : "Submit Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpForm;