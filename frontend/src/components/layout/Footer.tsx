import React from 'react';
import { Link } from 'react-router-dom';
import ahimsaHand from '@/assets/ahimsa-hand.png';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={ahimsaHand} 
                alt="Ahimsa Hand" 
                className="h-8 w-8 ahimsa-hand"
              />
              <span className="font-serif text-xl font-semibold">
                Jain Manuscripts Platform
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Preserving and sharing the sacred heritage of Jainism through digital manuscripts, 
              fostering research and spiritual growth for future generations.
            </p>
            <p className="text-sm text-muted-foreground italic">
              "Ahimsa paramo dharma" - Non-violence is the highest virtue
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary link-hover text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-muted-foreground hover:text-primary link-hover text-sm">
                  Browse Manuscripts
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary link-hover text-sm">
                  About Jainism
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary link-hover text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-serif font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/principles" className="text-muted-foreground hover:text-primary link-hover text-sm">
                  Jain Principles
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-muted-foreground hover:text-primary link-hover text-sm">
                  History
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-muted-foreground hover:text-primary link-hover text-sm">
                  Research Guidelines
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-primary link-hover text-sm">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Jain Manuscripts Platform. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Built with respect for Jain heritage and values
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;