import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { app } from '@/lib/firebase';

interface Stock {
  id: string;
  name: string;
  ticker: string;
  sentiment: string;
  sentimentScore: number;
  sentimentSource: string;
}

const SentimentAnalysis = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSentimentBadgeVariant = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'default';
      case 'Neutral':
        return 'secondary';
      case 'Negative':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Loading sentiment data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sentiment Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Real-time sentiment analysis for S&P 500 stocks
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Stock Sentiment</CardTitle>
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
          <CardDescription>
            Current sentiment analysis from various sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.name}</TableCell>
                    <TableCell>{stock.ticker}</TableCell>
                    <TableCell>
                      <Badge variant={getSentimentBadgeVariant(stock.sentiment)}>
                        {stock.sentiment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="bg-muted w-24 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              stock.sentiment === 'Positive' ? 'bg-green-500' : 
                              stock.sentiment === 'Negative' ? 'bg-red-500' : 
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${(stock.sentimentScore + 1) * 50}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{stock.sentimentScore.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{stock.sentimentSource}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No stocks matching your search criteria
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

export default SentimentAnalysis;
