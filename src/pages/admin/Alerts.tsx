// import React from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import { Badge } from '@/components/ui/badge';
// import {
//   AlertTriangle,
//   RefreshCcw,
//   Database,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// // Sample admin alerts data
// const adminAlerts = [
//   {
//     id: 1,
//     timestamp: '2025-05-15T09:34:21',
//     category: 'Model Retraining',
//     description: 'Stock prediction model has low confidence scores (<70%) for tech sector',
//     status: 'new',
//     action: 'retrain',
//   },
//   {
//     id: 2,
//     timestamp: '2025-05-14T16:22:10',
//     category: 'Data Source',
//     description: 'Failed to connect to Twitter API - authentication error',
//     status: 'new',
//     action: 'retry',
//   },
//   {
//     id: 3,
//     timestamp: '2025-05-14T08:45:33',
//     category: 'Model Retraining',
//     description: 'Sentiment model using outdated data (>15 days)',
//     status: 'resolved',
//     action: 'retrain',
//   },
//   {
//     id: 4,
//     timestamp: '2025-05-12T14:17:45',
//     category: 'System',
//     description: 'Database storage approaching capacity limit (85%)',
//     status: 'resolved',
//     action: 'none',
//   }
// ];

// const Alerts = () => {
//   // Format timestamp to readable date
//   const formatDate = (timestamp: string) => {
//     return new Date(timestamp).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Handle alert action button click
//   const handleAlertAction = (alert: typeof adminAlerts[0]) => {
//     console.log(`Performing ${alert.action} action on alert ID: ${alert.id}`);
    
//     if (alert.action === 'retrain') {
//       console.log('Triggering model retraining...');
//       // Implementation would connect to model retraining API
//     } else if (alert.action === 'retry') {
//       console.log('Retrying data source connection...');
//       // Implementation would reconnect to data source
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">System Alerts</h1>
//         <p className="text-muted-foreground mt-1">
//           Monitoring system health, model performance, and data source connections
//         </p>
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <Badge variant="outline" className="text-amber-500 border-amber-500">
//             {adminAlerts.filter(a => a.status === 'new').length} New
//           </Badge>
//           <Badge variant="outline" className="text-emerald-500 border-emerald-500">
//             {adminAlerts.filter(a => a.status === 'resolved').length} Resolved
//           </Badge>
//         </div>
//         <Button variant="outline" size="sm">
//           <RefreshCcw className="mr-2 h-4 w-4" />
//           Refresh Alerts
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Current Alerts</CardTitle>
//           <CardDescription>
//             System-level alerts that may require your attention
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {adminAlerts.map((alert) => (
//               <div key={alert.id} className="rounded-md border p-4">
//                 <div className="flex items-start justify-between">
//                   <div className="space-y-1">
//                     <div className="flex items-center">
//                       {alert.category === 'Model Retraining' ? (
//                         <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
//                       ) : (
//                         <Database className="h-5 w-5 mr-2 text-blue-500" />
//                       )}
//                       <h4 className="font-semibold">{alert.category}</h4>
//                       <Badge 
//                         variant="outline" 
//                         className={cn(
//                           "ml-2", 
//                           alert.status === 'new' ? "text-red-500 border-red-500" : "text-muted-foreground"
//                         )}
//                       >
//                         {alert.status === 'new' ? 'New' : 'Resolved'}
//                       </Badge>
//                     </div>
//                     <p className="text-sm">{alert.description}</p>
//                     <p className="text-xs text-muted-foreground">{formatDate(alert.timestamp)}</p>
//                   </div>
                  
//                   {alert.status === 'new' && alert.action !== 'none' && (
//                     <Button 
//                       size="sm" 
//                       variant={alert.action === 'retrain' ? 'outline' : 'secondary'}
//                       onClick={() => handleAlertAction(alert)}
//                     >
//                       {alert.action === 'retrain' ? 'Retrain Model' : 'Retry Connection'}
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Alerts;
