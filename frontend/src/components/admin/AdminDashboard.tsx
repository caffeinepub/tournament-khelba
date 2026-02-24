import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import TournamentManagementPanel from './TournamentManagementPanel';
import UserManagementPanel from './UserManagementPanel';
import PaymentManagementPanel from './PaymentManagementPanel';
import ResultsUploadPanel from './ResultsUploadPanel';
import AdminManagementSection from './AdminManagementSection';
import { useAdminCheck } from '../../hooks/useAdminCheck';
import { toast } from 'sonner';
import { Shield, Trophy, Users, CreditCard, Upload, Crown } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin, isLoading } = useAdminCheck();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate({ to: '/' });
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20">
          <Shield className="w-6 h-6 text-neon-cyan" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            {isSuperAdmin ? (
              <span className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-neon-orange" />
                Super Admin — Full access including admin management
              </span>
            ) : (
              'Admin — Full access to platform management'
            )}
          </p>
        </div>
      </div>

      <Tabs defaultValue="tournaments" className="space-y-6">
        <TabsList className={`grid w-full ${isSuperAdmin ? 'grid-cols-5' : 'grid-cols-4'} bg-card border border-border`}>
          <TabsTrigger value="tournaments" className="flex items-center gap-2 data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan">
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Tournaments</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2 data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2 data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Results</span>
          </TabsTrigger>
          {isSuperAdmin && (
            <TabsTrigger value="admins" className="flex items-center gap-2 data-[state=active]:bg-neon-orange/10 data-[state=active]:text-neon-orange">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Admins</span>
            </TabsTrigger>
          )}
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

        {isSuperAdmin && (
          <TabsContent value="admins">
            <div className="p-6 rounded-xl border border-border bg-card">
              <AdminManagementSection />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
