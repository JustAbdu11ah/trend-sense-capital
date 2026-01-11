
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Elevate Your Investment Strategy?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors who are already using sentiment analysis to make more informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-medium"
              >
                Get Started Free
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 font-medium"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-80">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
