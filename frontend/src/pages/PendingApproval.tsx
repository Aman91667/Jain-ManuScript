import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hourglass, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const PendingApproval: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Hourglass className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <CardTitle className="font-serif text-3xl">Application Pending</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Thank you for your interest, {user?.name}. Your application to become a researcher has been submitted and is currently under review by an administrator.
          </p>
          <p className="text-muted-foreground">
            We will notify you by email once a decision has been made. This may take up to 3-5 business days.
          </p>
          <Button asChild variant="outline">
            <a href="mailto:admin@jain-manuscripts.org">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;