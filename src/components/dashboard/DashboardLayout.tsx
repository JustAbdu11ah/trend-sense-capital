
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  isAdmin?: boolean;
}

const DashboardLayout = ({ isAdmin = false }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isAdmin={isAdmin}
      />
      
      <Header isCollapsed={isCollapsed} />
      
      <main 
        className={cn(
          "transition-all duration-300 min-h-[calc(100vh-4rem)] pt-6 pb-16",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="container mx-auto px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
