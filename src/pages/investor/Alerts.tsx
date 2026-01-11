
// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Bell, ChevronDown, ChevronUp, TrendingDown, TrendingUp } from 'lucide-react';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"

// // Mock alert data
// const mockAlerts = [
//   { 
//     id: 1, 
//     type: 'Buy', 
//     stock: 'NVDA', 
//     stockName: 'NVIDIA Corporation', 
//     timestamp: '2025-05-15 09:30 AM', 
//     sentimentChange: '+0.25', 
//     message: 'Significant positive sentiment increase detected.',
//     details: 'New product announcements and positive earnings forecast have triggered a surge in positive sentiment across Reddit and Twitter. Market analysts are highlighting the company\'s strong position in AI chips.'
//   },
//   { 
//     id: 2, 
//     type: 'Sell', 
//     stock: 'TSLA', 
//     stockName: 'Tesla Inc.', 
//     timestamp: '2025-05-14 02:15 PM', 
//     sentimentChange: '-0.18', 
//     message: 'Declining sentiment trend detected.',
//     details: 'Production challenges at Berlin Gigafactory and increased competition in the EV market have led to negative sentiment shift on social media platforms. Several financial news outlets have published cautious outlooks.'
//   },
//   { 
//     id: 3, 
//     type: 'Buy', 
//     stock: 'MSFT', 
//     stockName: 'Microsoft Corporation', 
//     timestamp: '2025-05-14 10:45 AM', 
//     sentimentChange: '+0.15', 
//     message: 'Positive sentiment trend emerging.',
//     details: 'Cloud services growth and AI integration announcements have triggered positive sentiment. Discussions on tech forums indicate strong developer enthusiasm for new platform features.'
//   },
//   { 
//     id: 4, 
//     type: 'Sell', 
//     stock: 'JNJ', 
//     stockName: 'Johnson & Johnson', 
//     timestamp: '2025-05-13 03:20 PM', 
//     sentimentChange: '-0.22', 
//     message: 'News-driven sentiment decline detected.',
//     details: 'Recent legal challenges and product recalls have significantly impacted market sentiment. News articles from multiple sources have highlighted potential financial implications.'
//   },
//   { 
//     id: 5, 
//     type: 'Buy', 
//     stock: 'AMZN', 
//     stockName: 'Amazon.com Inc.', 
//     timestamp: '2025-05-11 11:10 AM', 
//     sentimentChange: '+0.12', 
//     message: 'Sentiment recovering from previous negative trend.',
//     details: 'New service launches and positive fulfillment metrics have helped improve sentiment after last month\'s dip. Social media activity shows increasing consumer confidence in the brand.'
//   },
// ];

// // Group alerts by date
// const groupAlertsByDate = (alerts: typeof mockAlerts) => {
//   const groupedAlerts: Record<string, typeof mockAlerts> = {};
  
//   alerts.forEach(alert => {
//     const date = alert.timestamp.split(' ')[0]; // Extract the date part
//     if (!groupedAlerts[date]) {
//       groupedAlerts[date] = [];
//     }
//     groupedAlerts[date].push(alert);
//   });
  
//   return groupedAlerts;
// };

// const Alerts = () => {
//   const [alerts] = useState(mockAlerts);
//   const groupedAlerts = groupAlertsByDate(alerts);
//   const alertDates = Object.keys(groupedAlerts).sort().reverse();
  
//   const getAlertIcon = (type: string) => {
//     switch (type) {
//       case 'Buy':
//         return <TrendingUp className="h-4 w-4 mr-1" />;
//       case 'Sell':
//         return <TrendingDown className="h-4 w-4 mr-1" />;
//       default:
//         return <Bell className="h-4 w-4 mr-1" />;
//     }
//   };
  
//   const getAlertBadgeVariant = (type: string) => {
//     switch (type) {
//       case 'Buy':
//         return 'default';
//       case 'Sell':
//         return 'destructive';
//       default:
//         return 'secondary';
//     }
//   };
  
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Alerts</h1>
//         <p className="text-muted-foreground mt-1">
//           Buy/Sell alerts based on sentiment changes for your stocks
//         </p>
//       </div>
      
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Alerts</CardTitle>
//           <CardDescription>
//             Alerts are generated when significant sentiment changes are detected
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {alerts.length > 0 ? (
//             <Accordion type="single" collapsible className="w-full">
//               {alertDates.map((date, index) => (
//                 <AccordionItem value={`date-${index}`} key={date}>
//                   <AccordionTrigger className="hover:no-underline">
//                     <div className="flex items-center justify-between w-full pr-4">
//                       <span className="font-medium">{date}</span>
//                       <Badge variant="outline" className="ml-2">
//                         {groupedAlerts[date].length} {groupedAlerts[date].length === 1 ? 'alert' : 'alerts'}
//                       </Badge>
//                     </div>
//                   </AccordionTrigger>
//                   <AccordionContent>
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Time</TableHead>
//                           <TableHead>Stock</TableHead>
//                           <TableHead>Alert Type</TableHead>
//                           <TableHead>Sentiment Δ</TableHead>
//                           <TableHead>Details</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {groupedAlerts[date].map((alert) => (
//                           <TableRow key={alert.id}>
//                             <TableCell>{alert.timestamp.split(' ')[1]}</TableCell>
//                             <TableCell>
//                               <div className="font-medium">{alert.stock}</div>
//                               <div className="text-xs text-muted-foreground">{alert.stockName}</div>
//                             </TableCell>
//                             <TableCell>
//                               <Badge variant={getAlertBadgeVariant(alert.type)} className="flex w-fit items-center">
//                                 {getAlertIcon(alert.type)}
//                                 {alert.type} Alert
//                               </Badge>
//                             </TableCell>
//                             <TableCell className={alert.type === 'Buy' ? 'text-green-600' : 'text-red-600'}>
//                               {alert.sentimentChange}
//                             </TableCell>
//                             <TableCell>
//                               <Accordion type="single" collapsible className="w-full">
//                                 <AccordionItem value="details">
//                                   <AccordionTrigger className="py-1">
//                                     {alert.message}
//                                   </AccordionTrigger>
//                                   <AccordionContent>
//                                     <p className="text-sm text-muted-foreground">{alert.details}</p>
//                                   </AccordionContent>
//                                 </AccordionItem>
//                               </Accordion>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </AccordionContent>
//                 </AccordionItem>
//               ))}
//             </Accordion>
//           ) : (
//             <div className="text-center py-8">
//               <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
//               <p className="text-muted-foreground">No alerts yet</p>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Alerts will appear here when sentiment changes are detected for your stocks
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardHeader>
//           <CardTitle>How Alerts Work</CardTitle>
//           <CardDescription>
//             Understanding how our sentiment-based alert system operates
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <h3 className="font-semibold">Alert Types</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="border rounded-md p-4">
//                 <div className="flex items-center mb-2">
//                   <Badge variant="default" className="mr-2">
//                     <TrendingUp className="h-4 w-4 mr-1" />
//                     Buy Alert
//                   </Badge>
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   Generated when a significant positive sentiment shift is detected, suggesting a potential buying opportunity based on market sentiment.
//                 </p>
//               </div>
//               <div className="border rounded-md p-4">
//                 <div className="flex items-center mb-2">
//                   <Badge variant="destructive" className="mr-2">
//                     <TrendingDown className="h-4 w-4 mr-1" />
//                     Sell Alert
//                   </Badge>
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   Generated when a significant negative sentiment shift is detected, suggesting a potential selling opportunity to avoid downward price movement.
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="space-y-2">
//             <h3 className="font-semibold">Alert Triggers</h3>
//             <p className="text-sm text-muted-foreground">
//               Alerts are triggered by a combination of factors:
//             </p>
//             <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-4">
//               <li>Sentiment score change exceeding threshold (typically ±0.1 within 24 hours)</li>
//               <li>Unusual sentiment volatility compared to historical patterns</li>
//               <li>Significant divergence between sentiment sources (e.g., Reddit vs News)</li>
//               <li>Correlation between sentiment change and unusual trading volume</li>
//             </ul>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Alerts;
