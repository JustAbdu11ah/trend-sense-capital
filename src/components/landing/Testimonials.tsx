
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star
} from 'lucide-react';

const testimonials = [
  {
    quote: "NeuroTicks helped me understand market sentiment better than any other tool. I've seen a 22% increase in my portfolio since I started using it.",
    author: "Michael Chen",
    position: "Individual Investor",
    avatar: "MC"
  },
  {
    quote: "The sentiment analysis gives me an edge in understanding market dynamics. The simulation feature is a game-changer for testing strategies.",
    author: "Sarah Johnson",
    position: "Day Trader",
    avatar: "SJ"
  },
  {
    quote: "As a financial advisor, I use NeuroTicks to provide my clients with sentiment-backed recommendations. It's become an essential part of my toolkit.",
    author: "David Rodriguez",
    position: "Financial Advisor",
    avatar: "DR"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of investors who are making data-driven decisions with NeuroTicks.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Star Rating */}
              <div className="flex mb-4 text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="text-lg mb-6 flex-grow">
                "{testimonial.quote}"
              </blockquote>
              
              {/* Author Info */}
              <div className="flex items-center mt-auto">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
