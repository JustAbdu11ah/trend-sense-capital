
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  PieChart, 
  BarChart, 
  TrendingUp, 
  Settings, 
  Bell, 
  LogOut,
  Users,
  Database,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin?: boolean;
}

const Sidebar = ({ isCollapsed, setIsCollapsed, isAdmin = false }: SidebarProps) => {
  const location = useLocation();
  
  const investorLinks = [
    { 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/dashboard' 
    },
    { 
      name: 'Portfolio', 
      icon: <PieChart size={20} />, 
      path: '/portfolio' 
    },
    { 
      name: 'Sentiment Analysis', 
      icon: <BarChart size={20} />, 
      path: '/sentiment' 
    },
    { 
      name: 'Predictions & Simulation', 
      icon: <TrendingUp size={20} />, 
      path: '/predictions' 
    },
    // { 
    //   name: 'Alerts', 
    //   icon: <Bell size={20} />, 
    //   path: '/alerts' 
    // },
    { 
      name: 'Settings', 
      icon: <Settings size={20} />, 
      path: '/settings' 
    },
  ];
  
  const adminLinks = [
    { 
      name: 'User Management', 
      icon: <Users size={20} />, 
      path: '/admin/users' 
    },
    { 
      name: 'Data Sources', 
      icon: <Database size={20} />, 
      path: '/admin/data-sources' 
    },
    { 
      name: 'ML Models', 
      icon: <FileBarChart size={20} />, 
      path: '/admin/ml-models' 
    },
    // { 
    //   name: 'Alerts', 
    //   icon: <AlertTriangle size={20} />, 
    //   path: '/admin/alerts' 
    // },
    { 
      name: 'Settings', 
      icon: <Settings size={20} />, 
      path: '/admin/settings' 
    },
  ];

  const links = isAdmin ? adminLinks : investorLinks;

  return (
    <div 
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 border-b flex items-center px-4 justify-between">
        {!isCollapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <BarChart className="h-6 w-6 text-sidebar-primary" />
            <span className="font-display font-bold text-xl text-sidebar-foreground">
              NeuroTicks
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link to="/" className="w-full flex justify-center">
            <BarChart className="h-6 w-6 text-sidebar-primary" />
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-md font-medium transition-colors",
                location.pathname === link.path
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:bg-opacity-50",
                isCollapsed && "justify-center"
              )}
            >
              <span className="mr-3">{link.icon}</span>
              {!isCollapsed && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Sidebar Footer */}
      <div className="border-t p-4">
        <Link
          to="/."
          className={cn(
            "flex items-center px-3 py-2.5 rounded-md font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:bg-opacity-50 transition-colors",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut size={20} className="mr-3" />
          {!isCollapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
