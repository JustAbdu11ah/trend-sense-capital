
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  // Bell, 
  Search,
  User,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isCollapsed: boolean;
}

const Header = ({ isCollapsed }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Check if current path is admin route
  const isAdmin = location.pathname.includes('/admin');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    if (isAdmin) {
      // Admin search - search for users or data sources
      if (location.pathname.includes('/admin/users')) {
        // Search users by name/email
        console.log('Searching users:', searchQuery);
        // Implementation would connect to user search API
      } else if (location.pathname.includes('/admin/data-sources')) {
        // Search data sources by name
        console.log('Searching data sources:', searchQuery);
        // Implementation would connect to data sources search API
      } else {
        // Generic admin search
        console.log('Admin search:', searchQuery);
      }
    } else {
      // Investor search - search for stocks
      console.log('Searching stocks:', searchQuery);
      // Implementation would connect to stock search API
    }
  };
  
  // const handleAlertsClick = () => {
  //   if (isAdmin) {
  //     navigate('/admin/alerts');
  //   } else {
  //     navigate('/alerts');
  //   }
  // };
  
  const handleProfileClick = (route: string) => {
    if (isAdmin) {
      navigate(`/admin/${route}`);
    } else {
      navigate(`/${route}`);
    }
  };
  
  return (
    <header 
      className={cn(
        "h-16 border-b bg-card flex items-center justify-between px-4 transition-all duration-300",
        isCollapsed ? "ml-16" : "ml-64"
      )}
    >
      {/* Left side - Search */}
      <div className="flex items-center">
        <form onSubmit={handleSearch} className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isAdmin ? "Search users or sources..." : "Search stocks..."}
            className="w-full pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      
      {/* Right side - Notifications and User */}
      <div className="flex items-center space-x-2">
        {/* <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={handleAlertsClick}
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button> */}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <span className="mr-1 text-sm font-medium hidden sm:inline-block">
                  {isAdmin ? "Admin User" : "John Doe"}
                </span>
                <ChevronDown size={16} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleProfileClick('settings')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleProfileClick('settings')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/login')}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
