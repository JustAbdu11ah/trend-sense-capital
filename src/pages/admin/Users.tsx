
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  getUsers, 
  updateUser,
  deleteUser, 
  getDeactivationRequests, 
  deleteDeactivationRequest,
  getResetRequests,
  deleteResetRequest
} from '@/lib/firebase';

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  [key: string]: any;
}

interface DeactivationRequest {
  id: string;
  userId?: string;
  name?: string;
  email?: string;
  reason?: string;
  requestDate?: string | any;
  [key: string]: any;
}

interface ResetRequest {
  id: string;
  userId?: string;
  name?: string;
  email?: string;
  requestDate?: string | any;
  [key: string]: any;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [deactivations, setDeactivations] = useState<DeactivationRequest[]>([]);
  const [resets, setResets] = useState<ResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, deactivationData, resetData] = await Promise.all([
        getUsers(),
        getDeactivationRequests(),
        getResetRequests()
      ]);

      setUsers(usersData as User[]);
      setDeactivations(deactivationData as DeactivationRequest[]);
      setResets(resetData as ResetRequest[]);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error loading data",
        description: error.message || "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: any): string => {
    if (!date) return 'N/A';
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    if (date?.toDate && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString();
    }
    if (typeof date === 'string') {
      return date;
    }
    if (date?.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    return 'N/A';
  };

  const handleApproveDeactivation = async (requestId: string) => {
    try {
      const request = deactivations.find(req => req.id === requestId);
      if (!request) return;

      if (request.userId) {
        await updateUser(request.userId, { status: 'Inactive' });
      }

      await deleteDeactivationRequest(requestId);
      
      setDeactivations(deactivations.filter(req => req.id !== requestId));
      setUsers(users.map(user => 
        request.userId && user.id === request.userId
          ? { ...user, status: 'Inactive' }
          : user
      ));
      
      toast({
        title: "User deactivated",
        description: "The user account has been successfully deactivated.",
      });
    } catch (error: any) {
      console.error('Error approving deactivation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate user",
        variant: "destructive",
      });
    }
  };

  const handleRejectDeactivation = async (requestId: string) => {
    try {
      await deleteDeactivationRequest(requestId);
      setDeactivations(deactivations.filter(req => req.id !== requestId));
      
      toast({
        title: "Request rejected",
        description: "The deactivation request has been rejected.",
      });
    } catch (error: any) {
      console.error('Error rejecting deactivation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject request",
        variant: "destructive",
      });
    }
  };

  const handleSendResetEmail = async (requestId: string) => {
    try {
      await deleteResetRequest(requestId);
      setResets(resets.filter(req => req.id !== requestId));
      
      toast({
        title: "Reset email sent",
        description: "A password reset email has been sent to the user.",
      });
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setDeletingUserId(userId);
      await deleteUser(userId);
      
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "User deleted",
        description: "The user has been successfully removed from the system.",
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts, deactivation requests, and password resets
          </p>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading user data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage user accounts, deactivation requests, and password resets
        </p>
      </div>
      
      <Tabs defaultValue="deactivation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deactivation">Deactivation Requests</TabsTrigger>
          <TabsTrigger value="reset">Password Reset Requests</TabsTrigger>
          <TabsTrigger value="all">All Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deactivation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deactivation Requests</CardTitle>
              <CardDescription>
                Review and process account deactivation requests from users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deactivations.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No pending deactivation requests</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deactivations.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.name || 'N/A'}</TableCell>
                        <TableCell>{request.email || 'N/A'}</TableCell>
                        <TableCell>{request.reason || 'N/A'}</TableCell>
                        <TableCell>{formatDate(request.requestDate)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleApproveDeactivation(request.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRejectDeactivation(request.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reset" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password Reset Requests</CardTitle>
              <CardDescription>
                Send password reset emails to users who have requested them
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resets.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No pending reset requests</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resets.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.name || 'N/A'}</TableCell>
                        <TableCell>{request.email || 'N/A'}</TableCell>
                        <TableCell>{formatDate(request.requestDate)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleSendResetEmail(request.id)}
                          >
                            Send Reset Email
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Complete list of all registered users on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No users found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                        <TableCell>{user.email || 'N/A'}</TableCell>
                        <TableCell>{user.role || 'Investor'}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                            {user.status || 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                disabled={deletingUserId === user.id}
                              >
                                {deletingUserId === user.id ? 'Deleting...' : 'Delete'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the user
                                  account for <strong>{user.name || user.email}</strong> from the system.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Users;
