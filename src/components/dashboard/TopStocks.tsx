
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const stocksData = [
  { 
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 184.92,
    change: 1.25,
    sentiment: 'positive',
    confidence: 87,
    recommendation: 'buy'
  },
  { 
    id: 2,
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 410.34,
    change: 0.87,
    sentiment: 'positive',
    confidence: 82,
    recommendation: 'buy'
  },
  { 
    id: 3,
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 155.47,
    change: -0.25,
    sentiment: 'neutral',
    confidence: 64,
    recommendation: 'hold'
  },
  { 
    id: 4,
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 175.85,
    change: 2.05,
    sentiment: 'positive',
    confidence: 79,
    recommendation: 'buy'
  },
  { 
    id: 5,
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 177.58,
    change: -1.37,
    sentiment: 'negative',
    confidence: 72,
    recommendation: 'sell'
  },
];

const TopStocks = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Stocks by Sentiment</CardTitle>
        <CardDescription>
          Stocks with the highest sentiment scores from social media and news
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-12 bg-muted p-3 text-xs font-medium">
            <div className="col-span-3">Symbol</div>
            <div className="col-span-3">Price</div>
            <div className="col-span-2">Change</div>
            <div className="col-span-2">Sentiment</div>
            <div className="col-span-2">Action</div>
          </div>
          <div className="divide-y">
            {stocksData.map((stock) => (
              <div key={stock.id} className="grid grid-cols-12 p-3 text-sm items-center">
                <div className="col-span-3">
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                </div>
                <div className="col-span-3 font-medium">${stock.price}</div>
                <div className={cn(
                  "col-span-2 flex items-center",
                  stock.change > 0 ? "text-success" : "text-danger"
                )}>
                  {stock.change > 0 ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : (
                    <TrendingDown size={16} className="mr-1" />
                  )}
                  {Math.abs(stock.change)}%
                </div>
                <div className="col-span-2">
                  <Badge variant={
                    stock.sentiment === 'positive' ? 'default' : 
                    stock.sentiment === 'negative' ? 'destructive' : 
                    'outline'
                  }>
                    {stock.confidence}%
                  </Badge>
                </div>
                <div className="col-span-2">
                  <Badge variant={
                    stock.recommendation === 'buy' ? 'default' : 
                    stock.recommendation === 'sell' ? 'destructive' : 
                    'outline'
                  }>
                    {stock.recommendation.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopStocks;
