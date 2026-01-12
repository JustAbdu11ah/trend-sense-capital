
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Check, Edit, Globe, Trash, X } from 'lucide-react';

const initialDataSources = [
  { id: 1, name: 'Reddit API', url: 'https://www.reddit.com/r/WallStreetBets/.json', type: 'Sentiment', active: true },
  { id: 2, name: 'Twitter API', url: 'https://api.twitter.com/sentiment', type: 'Sentiment', active: true },
  { id: 3, name: 'Financial News API', url: 'https://api.financialnews.com/sentiment', type: 'Sentiment', active: true },
  { id: 4, name: 'Stock Market API', url: 'https://api.stockmarket.com/prices', type: 'Market Data', active: true },
];

const DataSources = () => {
  const [dataSources, setDataSources] = useState(initialDataSources);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newSource, setNewSource] = useState({ name: '', url: '', type: 'Sentiment' });
  const [currentSource, setCurrentSource] = useState<typeof initialDataSources[0] | null>(null);
  const { toast } = useToast();

  const handleAddSource = () => {
    if (!newSource.name || !newSource.url) {
      toast({
        title: "Validation Error",
        description: "Please provide both name and URL for the data source.",
        variant: "destructive"
      });
      return;
    }

    // Validate URL format
    try {
      new URL(newSource.url);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including the protocol (http:// or https://).",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(...dataSources.map(s => s.id), 0) + 1;
    setDataSources([...dataSources, { ...newSource, id: newId, active: true }]);
    setNewSource({ name: '', url: '', type: 'Sentiment' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Data Source Added",
      description: `${newSource.name} has been added successfully.`,
    });
  };

  const handleEditSource = () => {
    if (!currentSource) return;
    
    if (!currentSource.name || !currentSource.url) {
      toast({
        title: "Validation Error",
        description: "Please provide both name and URL for the data source.",
        variant: "destructive"
      });
      return;
    }

    // Validate URL format
    try {
      new URL(currentSource.url);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including the protocol (http:// or https://).",
        variant: "destructive"
      });
      return;
    }

    setDataSources(dataSources.map(source => 
      source.id === currentSource.id ? currentSource : source
    ));
    setIsEditDialogOpen(false);
    
    toast({
      title: "Data Source Updated",
      description: `${currentSource.name} has been updated successfully.`,
    });
  };

  const handleDeleteSource = (id: number) => {
    const sourceToDelete = dataSources.find(source => source.id === id);
    if (!sourceToDelete) return;
    
    setDataSources(dataSources.filter(source => source.id !== id));
    
    toast({
      title: "Data Source Deleted",
      description: `${sourceToDelete.name} has been removed.`,
    });
  };

  const toggleSourceStatus = (id: number) => {
    setDataSources(dataSources.map(source => 
      source.id === id ? { ...source, active: !source.active } : source
    ));
    
    const source = dataSources.find(s => s.id === id);
    if (!source) return;
    
    toast({
      title: source.active ? "Data Source Deactivated" : "Data Source Activated",
      description: `${source.name} has been ${source.active ? 'deactivated' : 'activated'}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Data Sources</h1>
          <p className="text-muted-foreground mt-1">
            Manage API connections for sentiment analysis and market data
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Source</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Data Source</DialogTitle>
              <DialogDescription>
                Add a new API endpoint for sentiment or market data
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Source Name</Label>
                <Input 
                  id="name" 
                  value={newSource.name} 
                  onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                  placeholder="e.g. Financial News API"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">API URL</Label>
                <Input 
                  id="url" 
                  value={newSource.url} 
                  onChange={(e) => setNewSource({...newSource, url: e.target.value})}
                  placeholder="https://api.example.com/endpoint"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Source Type</Label>
                <select 
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newSource.type}
                  onChange={(e) => setNewSource({...newSource, type: e.target.value})}
                >
                  <option value="Sentiment">Sentiment</option>
                  <option value="Market Data">Market Data</option>
                  <option value="News">News</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSource}>Add Source</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Data Sources</CardTitle>
          <CardDescription>
            API endpoints for collecting sentiment and market data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API URL</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataSources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-xs md:text-sm truncate max-w-[200px]">
                        {source.url}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{source.type}</TableCell>
                  <TableCell>
                    <div 
                      className={`flex items-center ${source.active ? 'text-green-600' : 'text-gray-400'}`}
                      onClick={() => toggleSourceStatus(source.id)}
                    >
                      {source.active ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          <span>Inactive</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog open={isEditDialogOpen && currentSource?.id === source.id} onOpenChange={(open) => {
                        if (open) {
                          setCurrentSource(source);
                        }
                        setIsEditDialogOpen(open);
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => {
                            setCurrentSource(source);
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Data Source</DialogTitle>
                            <DialogDescription>
                              Update the API endpoint information
                            </DialogDescription>
                          </DialogHeader>
                          
                          {currentSource && (
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Source Name</Label>
                                <Input 
                                  id="edit-name" 
                                  value={currentSource.name} 
                                  onChange={(e) => setCurrentSource({...currentSource, name: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="edit-url">API URL</Label>
                                <Input 
                                  id="edit-url" 
                                  value={currentSource.url} 
                                  onChange={(e) => setCurrentSource({...currentSource, url: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="edit-type">Source Type</Label>
                                <select 
                                  id="edit-type"
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  value={currentSource.type}
                                  onChange={(e) => setCurrentSource({...currentSource, type: e.target.value})}
                                >
                                  <option value="Sentiment">Sentiment</option>
                                  <option value="Market Data">Market Data</option>
                                  <option value="News">News</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>
                          )}
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleEditSource}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteSource(source.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSources;
