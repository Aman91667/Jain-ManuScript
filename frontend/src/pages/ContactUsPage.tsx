import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from 'lucide-react';

const ContactUsPage: React.FC = () => {
  // Simple form submission handler (kept for completeness, though the form is removed)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted!');
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen pt-12 pb-20 bg-muted/30">
      <div className="container mx-auto px-4">

        {/* Header Section: Reduced text size */}
        <header className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 text-foreground">
            Samyak Samvāda (Right Dialogue)
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Whether you have a question about a manuscript, an idea for collaboration, or need technical support, we are here to help.
          </p>
        </header>

        {/* Contact Grid: Info Card is centered */}
        <div className="grid grid-cols-1 max-w-6xl mx-auto justify-items-center">
          
          {/* Contact Information Card (Centered, Reduced Text) */}
          <Card className="w-full max-w-lg bg-gradient-parchment/80 border border-accent/20 h-full">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl flex items-center">
                <MessageCircle className="h-5 w-5 mr-3 text-primary" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              
              {/* General Enquiries */}
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-foreground">General Enquiries</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2 text-primary/80" />
                  <a href="mailto:info@jainheritageproject.org" className="hover:text-primary transition-colors">info@jainheritageproject.org</a>
                </div>
              </div>
              
              {/* Scholarly Submissions */}
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-foreground">Scholarly Submissions</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2 text-primary/80" />
                  <a href="mailto:research@jainheritageproject.org" className="hover:text-primary transition-colors">research@jainheritageproject.org</a>
                </div>
              </div>

              {/* Phone Support */}
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-foreground">Phone Support</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2 text-primary/80" />
                  <span>+91 123 456 7890 (Mon-Fri, 9am - 5pm IST)</span>
                </div>
              </div>

              {/* Project Office */}
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-foreground">Project Office</h4>
                <div className="flex items-start text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-primary/80" />
                  <address className="not-italic">
                    Jain Manuscript Preservation Center,<br />
                    101 Heritage Lane, <br />
                    Pune, Maharashtra 411001, India
                  </address>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ContactUsPage;