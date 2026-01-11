
import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Data Collection',
    description: 'We collect and analyze sentiment data from Reddit, Twitter, and financial news articles in real-time.'
  },
  {
    number: '02',
    title: 'Sentiment Analysis',
    description: 'Our ML models process and categorize sentiment as positive, negative, or neutral with confidence scores.'
  },
  {
    number: '03',
    title: 'Pattern Recognition',
    description: 'We identify patterns between sentiment shifts and stock price movements over time.'
  },
  {
    number: '04',
    title: 'Investment Recommendations',
    description: 'Based on sentiment data and historical patterns, we provide data-driven investment recommendations.'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Understanding the process behind our sentiment-driven investment predictions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-primary/30 -ml-4"></div>
              )}
              
              {/* Step Content */}
              <div className="bg-card border rounded-lg p-6 relative z-10">
                <div className="text-4xl font-bold text-primary/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg font-medium mb-4">
            Ready to make data-driven investment decisions?
          </p>
          <a href="/register" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
