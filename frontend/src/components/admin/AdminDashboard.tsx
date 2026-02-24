import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminCheck } from '../../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import TournamentManagementPanel from './TournamentManagementPanel';
import UserManagementPanel from './UserManagementPanel';
import PaymentManagementPanel from './PaymentManagementPanel';
import ResultsUploadPanel from './ResultsUploadPanel';
import AdminManagementSection from './AdminManagementSection';

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error('Access denied: Admin privileges required');
      navigate({ to: '/' });
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="bg-red-500/10 border-2 border-red-500/30">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">
              You do not have permission to access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-12 w-12 text-orange-400" />
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
          Admin Dashboard
        </h1>
      </div>

      <Alert className="bg-orange-500/10 border-orange-500/30">
        <Info className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Demo Mode:</strong> Admin functionality requires full backend implementation. 
          Forms and actions shown are for UI demonstration only.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="tournaments" className="space-y-6">
        <TabsList className="bg-gray-800 border border-orange-500/30">
          <TabsTrigger value="tournaments" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Tournaments
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Users
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Payments
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Results
          </TabsTrigger>
          <TabsTrigger value="admins" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Admin Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tournaments">
          <TournamentManagementPanel />
        </TabsContent>

        <TabsContent value="users">
          <UserManagementPanel />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentManagementPanel />
        </TabsContent>

        <TabsContent value="results">
          <ResultsUploadPanel />
        </TabsContent>

        <TabsContent value="admins">
          <AdminManagementSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
