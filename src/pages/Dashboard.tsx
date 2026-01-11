
import React from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import SentimentChart from '@/components/dashboard/SentimentChart';
import TopStocks from '@/components/dashboard/TopStocks';
import { 
  TrendingUp, 
  BarChart2, 
  PieChart, 
  AlertCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, John! Here's your investment summary.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Portfolio Value" 
          value="$24,875.65" 
          change={2.3} 
          changeText="from yesterday" 
          trend="up"
          icon={<PieChart size={20} />}
        />
        <StatsCard 
          title="Overall Sentiment" 
          value="Positive" 
          changeText="75% confidence" 
          trend="up"
          icon={<BarChart2 size={20} />}
        />
        <StatsCard 
          title="ROI vs S&P 500" 
          value="+5.2%" 
          changeText="outperforming" 
          trend="up"
          icon={<TrendingUp size={20} />}
        />
        <StatsCard 
          title="Active Alerts" 
          value="3" 
          changeText="2 new today" 
          trend="neutral"
          icon={<AlertCircle size={20} />}
        />
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentChart />
        
        <Card>
          <CardHeader>
            <CardTitle>Investment Predictions</CardTitle>
            <CardDescription>AI-driven predictions based on sentiment analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-medium">Tech Sector Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  Positive sentiment detected in tech sector, particularly in AI companies.
                </p>
              </div>
              <Button>View Details</Button>
            </div>
            
            <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-medium">Market Volatility Warning</h4>
                <p className="text-sm text-muted-foreground">
                  Mixed sentiment detected in overall market, suggesting increased volatility.
                </p>
              </div>
              <Button variant="outline">View Details</Button>
            </div>
            
            <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-medium">Healthcare Sector Trending</h4>
                <p className="text-sm text-muted-foreground">
                  Growing positive sentiment in healthcare startups with innovative solutions.
                </p>
              </div>
              <Button variant="outline">View Details</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Stocks */}
      <TopStocks />
    </div>
  );
};

export default Dashboard;
