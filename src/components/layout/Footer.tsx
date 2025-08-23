import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">RemnantHub</h3>
            <p className="text-sm text-muted-foreground">
              Connecting Christians with local communities for fellowship and spiritual growth.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Platform</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Find Communities
              </Link>
              <Link to="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </nav>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Support</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/report" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Report Content
              </Link>
              <Link to="/donate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Donate
              </Link>
              <a href="mailto:support@remnanthub.org" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </a>
            </nav>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
              <Link to="/data-rights" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Data Rights
              </Link>
            </nav>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RemnantHub. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            "For where two or three gather in my name, there am I with them." - Matthew 18:20
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;