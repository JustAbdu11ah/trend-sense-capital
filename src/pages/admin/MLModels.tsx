
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import defaultSentimentMetrics from "@/lib/defaultSentimentMetrics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, RefreshCcw, TrendingUp, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getStocks, db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getModelEvaluationMetrics } from '@/lib/modelEvaluationMetrics';

const initialModelVersions = [
  { 
    id: 1, 
    name: 'Sentiment Analysis Model', 
    version: '3.2.1', 
    accuracy: 0.86, 
    trainedDate: '2025-04-15', 
    status: 'active',
    dataPoints: 285000 
  },
  { 
    id: 2, 
    name: 'Stock Prediction Model', 
    version: '2.1.5', 
    accuracy: 0.78, 
    trainedDate: '2025-04-22', 
    status: 'active',
    dataPoints: 195000 
  },
  { 
    id: 3, 
    name: 'Market Trend Analyzer', 
    version: '1.3.7', 
    accuracy: 0.72, 
    trainedDate: '2025-05-01', 
    status: 'active',
    dataPoints: 150000 
  }
];

interface ClassMetrics {
  precision: number;
  recall: number;
  f1_score: number;
}

interface SentimentMetrics {
  total_predictions: number;
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  action_distribution: {
    buy: number;
    hold: number;
    sell: number;
  };
  confidence_stats: {
    mean: number;
    std_dev: number;
    min: number;
    max: number;
  };
  sentiment_score_stats: {
    mean: number;
    std_dev: number;
    min: number;
    max: number;
  };
  accuracy?: number;
  positive_metrics?: ClassMetrics;
  neutral_metrics?: ClassMetrics;
  negative_metrics?: ClassMetrics;
}

const MLModels = () => {
  const [modelVersions, setModelVersions] = useState(initialModelVersions);
  const [isTrainingInProgress, setIsTrainingInProgress] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingModel, setTrainingModel] = useState<number | null>(null);
  const [sentimentMetrics, setSentimentMetrics] = useState<SentimentMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSentimentMetrics();
  }, []);

  const fetchSentimentMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const stocks = await getStocks();
      
      if (stocks.length === 0) {
        setLoadingMetrics(false);
        return;
      }

      const metrics = calculateMetrics(stocks);
      
      // Try to fetch stored metrics from Firestore if available
      try {
        const metricsCollection = collection(db, "sentimentMetrics");
        let metricsSnapshot;
        
        try {
          // Try with orderBy first (requires index)
          const metricsQuery = query(metricsCollection, orderBy("timestamp", "desc"), limit(1));
          metricsSnapshot = await getDocs(metricsQuery);
        } catch (orderByError) {
          // If orderBy fails (no index), just get all and sort manually
          console.log('OrderBy failed, fetching all metrics and sorting manually');
          const allMetrics = await getDocs(metricsCollection);
          const sortedDocs = allMetrics.docs.sort((a, b) => {
            const aTime = a.data().timestamp?.toMillis?.() || a.data().timestamp?._seconds || 0;
            const bTime = b.data().timestamp?.toMillis?.() || b.data().timestamp?._seconds || 0;
            return bTime - aTime;
          });
          metricsSnapshot = { empty: sortedDocs.length === 0, docs: sortedDocs };
        }
        
        if (!metricsSnapshot.empty && metricsSnapshot.docs.length > 0) {
          const storedMetrics = metricsSnapshot.docs[0].data();
          console.log('Stored metrics found:', storedMetrics);
          
          if (storedMetrics.accuracy !== undefined && storedMetrics.accuracy !== null) {
            metrics.accuracy = storedMetrics.accuracy;
          }
          if (storedMetrics.positive_metrics) {
            metrics.positive_metrics = storedMetrics.positive_metrics;
          }
          if (storedMetrics.neutral_metrics) {
            metrics.neutral_metrics = storedMetrics.neutral_metrics;
          }
          if (storedMetrics.negative_metrics) {
            metrics.negative_metrics = storedMetrics.negative_metrics;
          }
        } else {
          console.log('No metrics documents found in Firestore, using calculated metrics');
        }
      } catch (error) {
        // Metrics collection doesn't exist or no metrics stored yet
        console.error('Error fetching stored metrics:', error);
      }
      //base values for the metrics
      if (
        !metrics.accuracy &&
        !metrics.positive_metrics &&
        !metrics.neutral_metrics &&
        !metrics.negative_metrics
      ) {
        // Load evaluation metrics from model evaluation results
        const evaluationMetrics = getModelEvaluationMetrics();
        metrics.accuracy = evaluationMetrics.accuracy;
        metrics.positive_metrics = evaluationMetrics.positive_metrics;
        metrics.neutral_metrics = evaluationMetrics.neutral_metrics;
        metrics.negative_metrics = evaluationMetrics.negative_metrics;
      }
      
      
      setSentimentMetrics(metrics);
    } catch (error) {
      console.error('Error fetching sentiment metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load sentiment metrics",
        variant: "destructive",
      });
    } finally {
      setLoadingMetrics(false);
    }
  };

  const calculateMetrics = (stocks: any[]): SentimentMetrics => {
    const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
    const actionCounts = { Buy: 0, Hold: 0, Sell: 0 };
    const confidenceScores: number[] = [];
    const sentimentScores: number[] = [];

    stocks.forEach((stock: any) => {
      const sentiment = stock.sentiment || 'Neutral';
      const action = stock.prediction?.action || 'Hold';
      const confidence = stock.prediction?.confidence || 0;
      const score = stock.sentimentScore || 0;

      if (sentiment in sentimentCounts) {
        sentimentCounts[sentiment as keyof typeof sentimentCounts]++;
      }
      if (action in actionCounts) {
        actionCounts[action as keyof typeof actionCounts]++;
      }
      confidenceScores.push(confidence);
      sentimentScores.push(score);
    });

    const total = stocks.length;

    const calculateMean = (arr: number[]) => 
      arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    
    const calculateStdDev = (arr: number[]) => {
      if (arr.length === 0) return 0;
      const mean = calculateMean(arr);
      const squaredDiffs = arr.map(x => Math.pow(x - mean, 2));
      return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / arr.length);
    };

    return {
      total_predictions: total,
      sentiment_distribution: {
        positive: total > 0 ? Number(((sentimentCounts.Positive / total) * 100).toFixed(2)) : 0,
        neutral: total > 0 ? Number(((sentimentCounts.Neutral / total) * 100).toFixed(2)) : 0,
        negative: total > 0 ? Number(((sentimentCounts.Negative / total) * 100).toFixed(2)) : 0,
      },
      action_distribution: {
        buy: total > 0 ? Number(((actionCounts.Buy / total) * 100).toFixed(2)) : 0,
        hold: total > 0 ? Number(((actionCounts.Hold / total) * 100).toFixed(2)) : 0,
        sell: total > 0 ? Number(((actionCounts.Sell / total) * 100).toFixed(2)) : 0,
      },
      confidence_stats: {
        mean: Number(calculateMean(confidenceScores).toFixed(3)),
        std_dev: Number(calculateStdDev(confidenceScores).toFixed(3)),
        min: confidenceScores.length > 0 ? Number(Math.min(...confidenceScores).toFixed(3)) : 0,
        max: confidenceScores.length > 0 ? Number(Math.max(...confidenceScores).toFixed(3)) : 0,
      },
      sentiment_score_stats: {
        mean: Number(calculateMean(sentimentScores).toFixed(4)),
        std_dev: Number(calculateStdDev(sentimentScores).toFixed(4)),
        min: sentimentScores.length > 0 ? Number(Math.min(...sentimentScores).toFixed(4)) : 0,
        max: sentimentScores.length > 0 ? Number(Math.max(...sentimentScores).toFixed(4)) : 0,
      },
    };
  };

  const handleRetrainModel = (modelId: number) => {
    const model = modelVersions.find(m => m.id === modelId);
    if (!model || isTrainingInProgress) return;
    
    setTrainingModel(modelId);
    setIsTrainingInProgress(true);
    setTrainingProgress(0);
    
    toast({
      title: "Training Started",
      description: `Training of ${model.name} has been initiated.`,
    });
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        const next = prev + Math.random() * 10;
        if (next >= 100) {
          clearInterval(interval);
          
          // Update model version and stats after training completes
          setTimeout(() => {
            const updatedVersions = modelVersions.map(m => {
              if (m.id === modelId) {
                // Increment version and improve accuracy slightly
                const versionParts = m.version.split('.');
                const lastPart = parseInt(versionParts[2]) + 1;
                const newVersion = `${versionParts[0]}.${versionParts[1]}.${lastPart}`;
                
                return {
                  ...m,
                  version: newVersion,
                  accuracy: Math.min(0.99, m.accuracy + Math.random() * 0.05),
                  trainedDate: new Date().toISOString().split('T')[0],
                  dataPoints: m.dataPoints + Math.floor(Math.random() * 25000)
                };
              }
              return m;
            });
            
            setModelVersions(updatedVersions);
            setIsTrainingInProgress(false);
            setTrainingModel(null);
            
            toast({
              title: "Training Complete",
              description: `${model.name} has been successfully retrained with improved accuracy.`,
            });
          }, 1000);
          
          return 100;
        }
        return next;
      });
    }, 500);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ML Models</h1>
        <p className="text-muted-foreground mt-1">
          Manage and retrain machine learning models for sentiment analysis and predictions
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Models</CardTitle>
          <CardDescription>
            Review and manage ML models currently in production
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Last Trained</TableHead>
                <TableHead>Data Points</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelVersions.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>v{model.version}</TableCell>
                  <TableCell>{(model.accuracy * 100).toFixed(1)}%</TableCell>
                  <TableCell>{model.trainedDate}</TableCell>
                  <TableCell>{formatNumber(model.dataPoints)}</TableCell>
                  <TableCell>
                    <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                      {model.status === 'active' ? 'Production' : 'Testing'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {trainingModel === model.id ? (
                      <div className="w-[180px]">
                        <Progress value={trainingProgress} className="h-2 mb-1" />
                        <p className="text-xs text-muted-foreground">
                          Training... {Math.round(trainingProgress)}%
                        </p>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleRetrainModel(model.id)}
                        disabled={isTrainingInProgress}
                      >
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Retrain Model
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sentiment Analysis Model Metrics
          </CardTitle>
          <CardDescription>
            Real-time performance metrics from the FinBERT sentiment analysis model
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingMetrics ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading metrics...
            </div>
          ) : !sentimentMetrics ? (
            <div className="py-8 text-center text-muted-foreground">
              No metrics available. Run sentiment analysis to generate metrics.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{sentimentMetrics.total_predictions}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total Predictions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {(sentimentMetrics.confidence_stats.mean * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Avg Confidence</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {sentimentMetrics.sentiment_score_stats.mean > 0 ? '+' : ''}
                      {sentimentMetrics.sentiment_score_stats.mean.toFixed(3)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Avg Sentiment Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {sentimentMetrics.sentiment_distribution.positive.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Positive Sentiment</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sentiment Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Positive</span>
                        <span className="font-medium">{sentimentMetrics.sentiment_distribution.positive}%</span>
                      </div>
                      <Progress value={sentimentMetrics.sentiment_distribution.positive} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Neutral</span>
                        <span className="font-medium">{sentimentMetrics.sentiment_distribution.neutral}%</span>
                      </div>
                      <Progress value={sentimentMetrics.sentiment_distribution.neutral} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Negative</span>
                        <span className="font-medium">{sentimentMetrics.sentiment_distribution.negative}%</span>
                      </div>
                      <Progress value={sentimentMetrics.sentiment_distribution.negative} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Action Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Buy</span>
                        <span className="font-medium">{sentimentMetrics.action_distribution.buy}%</span>
                      </div>
                      <Progress value={sentimentMetrics.action_distribution.buy} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Hold</span>
                        <span className="font-medium">{sentimentMetrics.action_distribution.hold}%</span>
                      </div>
                      <Progress value={sentimentMetrics.action_distribution.hold} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Sell</span>
                        <span className="font-medium">{sentimentMetrics.action_distribution.sell}%</span>
                      </div>
                      <Progress value={sentimentMetrics.action_distribution.sell} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Confidence Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Mean</TableCell>
                          <TableCell className="text-right">
                            {(sentimentMetrics.confidence_stats.mean * 100).toFixed(2)}%
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Standard Deviation</TableCell>
                          <TableCell className="text-right">
                            {(sentimentMetrics.confidence_stats.std_dev * 100).toFixed(2)}%
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Minimum</TableCell>
                          <TableCell className="text-right">
                            {(sentimentMetrics.confidence_stats.min * 100).toFixed(2)}%
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Maximum</TableCell>
                          <TableCell className="text-right">
                            {(sentimentMetrics.confidence_stats.max * 100).toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sentiment Score Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Mean</TableCell>
                          <TableCell className="text-right">
                            {sentimentMetrics.sentiment_score_stats.mean > 0 ? '+' : ''}
                            {sentimentMetrics.sentiment_score_stats.mean.toFixed(4)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Standard Deviation</TableCell>
                          <TableCell className="text-right">
                            {sentimentMetrics.sentiment_score_stats.std_dev.toFixed(4)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Minimum</TableCell>
                          <TableCell className="text-right">
                            {sentimentMetrics.sentiment_score_stats.min.toFixed(4)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Maximum</TableCell>
                          <TableCell className="text-right">
                            {sentimentMetrics.sentiment_score_stats.max.toFixed(4)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Classification Performance Metrics
                  </CardTitle>
                  <CardDescription>
                    Precision, Recall, and F1 Score by sentiment class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sentimentMetrics.accuracy !== undefined ? (
                    <div className="mb-6 p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall Accuracy</span>
                        <span className="text-2xl font-bold">
                          {(sentimentMetrics.accuracy * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall Accuracy</span>
                        <span className="text-2xl font-bold text-muted-foreground">N/A</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Requires labeled ground truth data</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Positive Class</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Precision</TableCell>
                              <TableCell className="text-right">
                                {sentimentMetrics.positive_metrics ? (
                                  (sentimentMetrics.positive_metrics.precision * 100).toFixed(2) + '%'
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Recall</TableCell>
                              <TableCell className="text-right">
                                {sentimentMetrics.positive_metrics ? (
                                  (sentimentMetrics.positive_metrics.recall * 100).toFixed(2) + '%'
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">F1 Score</TableCell>
                              <TableCell className="text-right font-bold">
                                {sentimentMetrics.positive_metrics ? (
                                  (sentimentMetrics.positive_metrics.f1_score * 100).toFixed(2) + '%'
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Neutral Class</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Precision</TableCell>
                              <TableCell className="text-right">
                                {sentimentMetrics.neutral_metrics ? (
                                  (sentimentMetrics.neutral_metrics.precision * 100).toFixed(2) + '%'
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Recall</TableCell>
                              <TableCell className="text-right">
                                {sentimentMetrics.neutral_metrics ? (
                                  (sentimentMetrics.neutral_metrics.recall * 100).toFixed(2) + '%'
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">F1 Score</TableCell>
                              <TableCell className="text-right font-bold">
                                {sentimentMetrics.neutral_metrics ? (
                                  (sentimentMetrics.neutral_metrics.f1_score * 100).toFixed(2) + '%'
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Negative Class</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Precision</TableCell>
                              <TableCell className="text-right">
                                {sentimentMetrics.negative_metrics ? (
                                  (sentimentMetrics.negative_metrics.precision * 100).toFixed(2) + '%'
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Recall</TableCell>
                              <TableCell className="text-right">
                                {sentimentMetrics.negative_metrics ? (
                                  (sentimentMetrics.negative_metrics.recall * 100).toFixed(2) + '%'
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">F1 Score</TableCell>
                              <TableCell className="text-right font-bold">
                                {sentimentMetrics.negative_metrics ? (
                                  (sentimentMetrics.negative_metrics.f1_score * 100).toFixed(2) + '%'
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>

                  {!sentimentMetrics.positive_metrics && 
                   !sentimentMetrics.neutral_metrics && 
                   !sentimentMetrics.negative_metrics && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Note:</strong> Precision, Recall, and F1 Score metrics require labeled ground truth data. 
                        Run the sentiment analysis script with ground truth labels to see these metrics.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button variant="outline" onClick={fetchSentimentMetrics}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh Metrics
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Training History</CardTitle>
          <CardDescription>
            Review past training sessions and their performance improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Training Date</TableHead>
                <TableHead>Accuracy Gain</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Sentiment Analysis Model</TableCell>
                <TableCell>v3.2.0 → v3.2.1</TableCell>
                <TableCell>2025-04-15</TableCell>
                <TableCell className="text-green-600">+2.1%</TableCell>
                <TableCell>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Successful</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Stock Prediction Model</TableCell>
                <TableCell>v2.1.4 → v2.1.5</TableCell>
                <TableCell>2025-04-22</TableCell>
                <TableCell className="text-green-600">+1.8%</TableCell>
                <TableCell>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Successful</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Market Trend Analyzer</TableCell>
                <TableCell>v1.3.6 → v1.3.7</TableCell>
                <TableCell>2025-05-01</TableCell>
                <TableCell className="text-green-600">+1.5%</TableCell>
                <TableCell>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Successful</span>
                  </div>
                </TableCell>
              </TableRow>
              
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLModels;
