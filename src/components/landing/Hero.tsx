
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart4, PieChart } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-20 left-10 sentiment-bubble sentiment-positive w-24 h-24">
          <TrendingUp size={24} />
        </div>
        <div className="absolute top-40 right-20 sentiment-bubble sentiment-negative w-16 h-16">
          <BarChart4 size={20} />
        </div>
        <div className="absolute bottom-20 left-1/4 sentiment-bubble sentiment-neutral w-20 h-20">
          <PieChart size={20} />
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="text-primary">Data-Driven</span> Investment Decisions
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Harness the power of sentiment analysis from Reddit, Twitter, and financial news to make smarter investment decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="font-medium">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/simulation">
                <Button size="lg" variant="outline" className="font-medium">
                  Try Simulation
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center text-sm text-muted-foreground">
              <span className="flex items-center mr-6">
                <svg className="w-4 h-4 mr-1 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                No credit card required
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                14-day free trial
              </span>
            </div>
          </div>
          
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <div className="relative bg-white dark:bg-sidebar-background rounded-xl shadow-xl overflow-hidden border">
              <div className="p-2 bg-secondary dark:bg-sidebar-accent border-b flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-danger"></div>
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <div className="w-3 h-3 rounded-full bg-success"></div>
              </div>
              <div className="p-4">
                <img 
                  src="https://images.unsplash.com/photo-1642543348745-03b1219733d9?q=80&w=1000&auto=format&fit=crop"
                  alt="Stock Analysis Dashboard" 
                  className="rounded-md shadow-sm w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
