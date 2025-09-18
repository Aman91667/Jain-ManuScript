// frontend/src/components/common/RequestAccessButton.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom';

interface RequestAccessButtonProps {
  manuscriptId: string; // ✅ Keep the prop for type compatibility, even if unused
}

const RequestAccessButton: React.FC<RequestAccessButtonProps> = ({ manuscriptId }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRequest = () => {
    if (user?.role !== 'user') {
      toast({
        title: "Error",
        description: "Only normal users can apply for researcher status.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to dashboard for applying as researcher
    navigate('/dashboard');
  };

  return (
    <Button
      variant="hero"
      size="lg"
      className="flex-1"
      onClick={handleRequest}
    >
      <div className="flex items-center">
        <UserPlus className="mr-2 h-4 w-4" />
        Request Access
      </div>
    </Button>
  );
};

export default RequestAccessButton;
