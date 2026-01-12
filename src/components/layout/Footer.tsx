
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Twitter, 
  Linkedin, 
  Github, 
  Mail 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BarChart className="h-6 w-6 text-primary" />
              <span className="font-display font-bold text-xl">NeuroTicks</span>
            </div>
            
            </div>

          {/* Quick Links */}
          

          

          
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} NeuroTicks. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
