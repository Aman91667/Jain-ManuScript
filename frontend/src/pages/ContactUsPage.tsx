import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const ContactUsPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted!');
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen pt-12 pb-20 bg-muted/30">
      <div className="container mx-auto px-4">

        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 text-foreground">
           Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Whether you have a question about a manuscript, an idea for collaboration, or need technical support, we are here to help.
          </p>
        </header>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 max-w-6xl mx-auto justify-items-center">
          
          {/* Contact Information Card */}
          <Card className="w-full max-w-lg bg-gradient-parchment/80 border border-accent/20 text-center p-6 md:p-8">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl flex flex-col items-center">
                <MessageCircle className="h-6 w-6 mb-2 text-primary" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">

              {/* General Enquiries */}
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-foreground">General Enquiries</h4>
                <div className="flex flex-col items-center text-sm text-muted-foreground">
                  <Mail className="h-5 w-5 mb-1 text-primary/80" />
                  <a href="mailto:ShrutGyanKosh@gmail.com" className="hover:text-primary transition-colors">
                    ShrutGyanKosh@gmail.com
                  </a>
                </div>
              </div>
              
              {/* Scholarly Submissions */}
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-foreground">Scholarly Submissions</h4>
                <div className="flex flex-col items-center text-sm text-muted-foreground">
                  <Mail className="h-5 w-5 mb-1 text-primary/80" />
                  <a href="mailto:ShrutGyanKosh@gmail.com" className="hover:text-primary transition-colors">
                    ShrutGyanKosh@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone Support */}
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-foreground">Phone Support</h4>
                <div className="flex flex-col items-center text-sm text-muted-foreground">
                  <Phone className="h-5 w-5 mb-1 text-primary/80" />
                  <span>+91 80007 86544 (Mon-Fri, 9am - 5pm IST)</span>
                </div>
              </div>

              {/* Project Office */}
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-foreground">Project Office</h4>
                <div className="flex flex-col items-center text-sm text-muted-foreground">
                  <MapPin className="h-5 w-5 mb-1 text-primary/80" />
                  <address className="not-italic text-center">
                    30-133,<br />
                    Maniharo Ka Rastsa, Tripolia Bazar, Modikhana <br />
                    Jaipur, Rajasthan, India (Bharat)
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
