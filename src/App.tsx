
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Investor Pages
import Stocks from "./pages/investor/Stocks";
import Portfolio from "./pages/investor/Portfolio";
import SentimentAnalysis from "./pages/investor/SentimentAnalysis";
import Predictions from "./pages/investor/Predictions";
// import Alerts from "./pages/investor/Alerts";
import Settings from "./pages/investor/Settings";

// Admin Pages
import Users from "./pages/admin/Users";
import DataSources from "./pages/admin/DataSources";
import MLModels from "./pages/admin/MLModels";
// import AdminAlerts from "./pages/admin/Alerts";
import AdminSettings from "./pages/admin/Settings";

// Layout Components
import DashboardLayout from "./components/dashboard/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Investor Dashboard Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Stocks />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/sentiment" element={<SentimentAnalysis />} />
            <Route path="/predictions" element={<Predictions />} />
            {/* <Route path="/alerts" element={<Alerts />} /> */}
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/" element={<DashboardLayout isAdmin={true} />}>
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/data-sources" element={<DataSources />} />
            <Route path="/admin/ml-models" element={<MLModels />} />
            {/* <Route path="/admin/alerts" element={<AdminAlerts />} /> */}
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
          
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
