
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  UserCircle,
  Shield,
  Bell,
  Download,
  RotateCcw
} from 'lucide-react';

const Settings = () => {
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin User',
    email: 'admin@NeuroTicks.com',
    role: 'Administrator'
  });
  
  const [systemSettings, setSystemSettings] = useState({
    autoRetrain: true,
    emailAlerts: true
  });
  
  const { toast } = useToast();
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile Updated",
      description: "Your admin profile information has been saved successfully.",
    });
  };
  
  const handleSystemSettingChange = (key: keyof typeof systemSettings, value: boolean) => {
    setSystemSettings({
      ...systemSettings,
      [key]: value
    });
    
    const settingName = key === 'autoRetrain' ? 'Auto-retrain models' : 'Email alerts';
    
    toast({
      title: "System Setting Updated",
      description: `${settingName} are now ${value ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleSystemLogExport = () => {
    toast({
      title: "Generating System Logs",
      description: "System logs export has been initiated. You'll receive a download link shortly.",
    });
    
    // Simulate download preparation
    setTimeout(() => {
      toast({
        title: "System Logs Ready",
        description: "Your system logs export is ready for download.",
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your admin account settings and system preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              <CardTitle>Admin Profile</CardTitle>
            </div>
            <CardDescription>
              Update your administrator account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={adminProfile.name} 
                  onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={adminProfile.email} 
                  onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={adminProfile.role} disabled />
                <p className="text-xs text-muted-foreground mt-1">
                  Administrator role cannot be changed.
                </p>
              </div>
              
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
        
        {/* System Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>System Settings</CardTitle>
            </div>
            <CardDescription>
              Configure system behavior and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Model Training</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-retrain">Auto-Retrain Models</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically retrain ML models when confidence drops below threshold
                  </p>
                </div>
                <Switch 
                  id="auto-retrain" 
                  checked={systemSettings.autoRetrain}
                  onCheckedChange={(checked) => handleSystemSettingChange('autoRetrain', checked)}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Notifications</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive critical system alerts via email
                  </p>
                </div>
                <Switch 
                  id="email-alerts" 
                  checked={systemSettings.emailAlerts}
                  onCheckedChange={(checked) => handleSystemSettingChange('emailAlerts', checked)}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">System Maintenance</h3>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={handleSystemLogExport}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export System Logs
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset System Cache
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
