
import React from 'react';
import { 
  MessageSquare, 
  BarChart2, 
  TrendingUp, 
  Zap,
  Shield, 
  Users
} from 'lucide-react';

const features = [
  {
    icon: <MessageSquare size={24} className="text-primary" />,
    title: "Sentiment Analysis",
    description: "Analyze social media sentiment from Reddit, Twitter, and financial news to understand market perception."
  },
  {
    icon: <BarChart2 size={24} className="text-primary" />,
    title: "Performance Comparison",
    description: "Compare your portfolio performance against market benchmarks like S&P 500."
  },
  {
    icon: <TrendingUp size={24} className="text-primary" />,
    title: "Predictive Analysis",
    description: "Get data-driven investment recommendations with confidence scores based on sentiment trends."
  },
  {
    icon: <Zap size={24} className="text-primary" />,
    title: "Strategy Simulation",
    description: "Test your investment strategies with historical data and sentiment overlays before investing real money."
  },
  {
    icon: <Shield size={24} className="text-primary" />,
    title: "Risk Assessment",
    description: "Understand potential risks with detailed analysis and visual representation of sentiment volatility."
  },
  {
    icon: <Users size={24} className="text-primary" />,
    title: "Community Insights",
    description: "Access aggregated insights from thousands of retail investors and financial communities."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Platform Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines sentiment analysis with financial data to provide you with powerful investment tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
