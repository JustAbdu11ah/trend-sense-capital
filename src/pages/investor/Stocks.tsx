import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface Stock {
  id: string;
  name: string;
  ticker: string;
  currentPrice: number;
  change: number;
  sentiment: string;
  sentimentScore: number;
  sentimentSource: string;
  prediction: {
    action: string;
    confidence: number;
    reasoning: string;
  };
}

const Stocks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const db = getFirestore(app);
    const stocksCollection = collection(db, "stocks");
    const stocksQuery = query(stocksCollection, orderBy("ticker"));

    // Set up real-time listener
    const unsubscribe = onSnapshot(stocksQuery, 
      (snapshot) => {
        const stocksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Stock[];
        setStocks(stocksData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching stocks:", error);
        toast({
          title: "Error",
          description: "Failed to fetch stocks data",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]);

  // Get top 10 performers by change percentage
  const topPerformers = useMemo(() => {
    return stocks
      .filter(stock => stock.change !== undefined && !isNaN(stock.change))
      .sort((a, b) => b.change - a.change)
      .slice(0, 10)
      .map(stock => ({
        ticker: stock.ticker,
        name: stock.name,
        change: stock.change,
        price: stock.currentPrice,
      }));
  }, [stocks]);

  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToPortfolio = (stock: Stock) => {
    // Get current portfolio from localStorage
    const savedPortfolio = localStorage.getItem('portfolio');
    const currentPortfolio = savedPortfolio ? JSON.parse(savedPortfolio) : [];
    
    // Check if stock is already in portfolio
    if (currentPortfolio.some((s: Stock) => s.id === stock.id)) {
      toast({
        title: "Already in Portfolio",
        description: `${stock.ticker} is already in your portfolio.`,
      });
      return;
    }
    
    // Add stock to portfolio
    const updatedPortfolio = [...currentPortfolio, stock];
    localStorage.setItem('portfolio', JSON.stringify(updatedPortfolio));
    
    toast({
      title: "Stock Added",
      description: `${stock.ticker} has been added to your portfolio.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading stocks data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Top Stocks</h1>
        <p className="text-muted-foreground mt-1">Browse and add stocks to your portfolio</p>
      </div>
      
      {/* Top Performers Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Latest market trends for top-performing stocks</CardDescription>
        </CardHeader>
        <CardContent>
          {topPerformers.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topPerformers}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="ticker"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{data.name}</p>
                            <p className="text-sm text-muted-foreground">{data.ticker}</p>
                            <p className="text-sm">
                              Change: <span className={data.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                              </span>
                            </p>
                            <p className="text-sm">Price: ${data.price.toFixed(2)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="change" radius={[8, 8, 0, 0]}>
                    {topPerformers.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.change >= 0 ? '#10B981' : '#EF4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-10 w-10 mx-auto mb-2" />
                <p>No stock data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Stock Listing */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>All Stocks</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search stocks..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Prediction</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => {
                  const savedPortfolio = localStorage.getItem('portfolio');
                  const currentPortfolio = savedPortfolio ? JSON.parse(savedPortfolio) : [];
                  const isInPortfolio = currentPortfolio.some((s: Stock) => s.id === stock.id);

                  return (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.name}</TableCell>
                    <TableCell>{stock.ticker}</TableCell>
                    <TableCell className="text-right">${stock.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className={`text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                    </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          stock.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                          stock.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {stock.sentiment}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          stock.prediction.action === 'Buy' ? 'bg-green-100 text-green-800' :
                          stock.prediction.action === 'Sell' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {stock.prediction.action} ({stock.prediction.confidence * 100}%)
                        </span>
                      </TableCell>
                    <TableCell>
                      <Button 
                          variant={isInPortfolio ? "secondary" : "default"} 
                        size="sm"
                          onClick={() => addToPortfolio(stock)}
                          disabled={isInPortfolio}
                      >
                          {isInPortfolio ? 'Added' : 'Add to Portfolio'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No stocks matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stocks;
