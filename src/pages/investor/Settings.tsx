
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Bell,
  Mail,
  Shield,
  UserCircle,
} from 'lucide-react';

const Settings = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Investor'
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sentimentAlerts: true,
    priceAlerts: false,
    weeklyReport: true,
    newPredictions: true
  });
  
  const [resetEmail, setResetEmail] = useState('');
  const [isResetRequested, setIsResetRequested] = useState(false);
  const { toast } = useToast();
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would call an API to update the user's profile
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };
  
  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications({
      ...notifications,
      [key]: value
    });
    
    toast({
      title: "Notification Settings Updated",
      description: `${key} notifications are now ${value ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handlePasswordResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to request a password reset.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would call an API to send a reset email
    setIsResetRequested(true);
    
    toast({
      title: "Reset Email Sent",
      description: `A password reset link has been sent to ${resetEmail}. Please check your inbox.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Update your account information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={userProfile.name} 
                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={userProfile.email} 
                  onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={userProfile.phone} 
                  onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select disabled value={userProfile.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Account Types</SelectLabel>
                      <SelectItem value="Investor">Investor</SelectItem>
                      <SelectItem value="Admin">Administrator</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Account type cannot be changed. Contact support for assistance.
                </p>
              </div>
              
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Password & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Password & Security</CardTitle>
            </div>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Password Reset</h3>
              
              {isResetRequested ? (
                <div className="bg-primary/10 p-4 rounded-md">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Reset Email Sent</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    A password reset link has been sent to your email address. 
                    Please check your inbox and follow the instructions to reset your password.
                  </p>
                  <Button 
                    variant="link" 
                    className="px-0 mt-2"
                    onClick={() => setIsResetRequested(false)}
                  >
                    Send another reset link
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordResetRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email Address</Label>
                    <Input 
                      id="reset-email" 
                      type="email" 
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email to receive a reset link"
                    />
                  </div>
                  <Button type="submit" variant="outline" className="w-full">
                    Send Reset Link
                  </Button>
                </form>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Security Settings</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">
                    Enhance account security with SMS verification
                  </p>
                </div>
                <Switch id="two-factor" disabled aria-label="Coming soon" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="login-alerts">Login Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive email notifications on new login attempts
                  </p>
                </div>
                <Switch id="login-alerts" disabled aria-label="Coming soon" />
              </div>
              
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Advanced security features coming soon
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Notification Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>
              Control how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium">Notification Channels</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications in browser
                      </p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="font-medium">Notification Types</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sentiment-alerts">Sentiment Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Notifications for significant sentiment changes
                      </p>
                    </div>
                    <Switch 
                      id="sentiment-alerts" 
                      checked={notifications.sentimentAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('sentimentAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="price-alerts">Price Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Notifications for significant price changes
                      </p>
                    </div>
                    <Switch 
                      id="price-alerts" 
                      checked={notifications.priceAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('priceAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-report">Weekly Report</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive weekly performance summary
                      </p>
                    </div>
                    <Switch 
                      id="weekly-report" 
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => handleNotificationChange('weeklyReport', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-predictions">New Predictions</Label>
                      <p className="text-xs text-muted-foreground">
                        Notifications when new predictions are available
                      </p>
                    </div>
                    <Switch 
                      id="new-predictions" 
                      checked={notifications.newPredictions}
                      onCheckedChange={(checked) => handleNotificationChange('newPredictions', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
