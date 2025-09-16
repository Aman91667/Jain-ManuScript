import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserPlus } from 'lucide-react';
import ahimsaHand from '@/assets/ahimsa-hand.png';

const SignupLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-parchment flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={ahimsaHand} alt="Ahimsa Hand" className="h-12 w-12 ahimsa-hand" />
            <span className="font-serif text-2xl font-semibold text-foreground">
              Jain Manuscripts
            </span>
          </div>
          <p className="text-muted-foreground">
            Join our community
          </p>
        </div>
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Create an Account</CardTitle>
            <CardDescription>
              Choose your account type to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild variant="hero" size="lg" className="w-full">
              <Link to="/signup/researcher">
                <UserPlus className="mr-2 h-4 w-4" />
                Apply as a Researcher
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link to="/signup/user">
                <User className="mr-2 h-4 w-4" />
                Sign up as a Standard User
              </Link>
            </Button>
          </CardContent>
        </Card>
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 link-hover font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupLanding;