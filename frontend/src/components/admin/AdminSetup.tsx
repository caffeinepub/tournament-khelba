import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetSuperAdmin, useClaimSuperAdmin } from '../../hooks/useAdminQueries';
import { useAdminCheck } from '../../hooks/useAdminCheck';
import { useActor } from '../../hooks/useActor';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, LogIn, CheckCircle, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSetup() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: superAdmin, isLoading: loadingSuperAdmin } = useGetSuperAdmin();
  const claimMutation = useClaimSuperAdmin();
  const { isAdmin, isSuperAdmin, isLoading: checkingAdmin } = useAdminCheck();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const callerPrincipal = identity?.getPrincipal().toString();

  const superAdminAlreadySet =
    superAdmin !== null && superAdmin !== undefined;
  const currentUserIsSuperAdmin =
    superAdminAlreadySet && callerPrincipal === superAdmin?.toString();

  // Redirect to admin dashboard if user is already admin
  useEffect(() => {
    if (!checkingAdmin && isAdmin) {
      toast.success('Admin access granted! Redirecting to admin dashboard...');
      setTimeout(() => {
        navigate({ to: '/admin' });
      }, 1500);
    }
  }, [isAdmin, checkingAdmin, navigate]);

  // Auto-attempt claim once actor is ready and user is authenticated
  useEffect(() => {
    if (
      isAuthenticated &&
      actor &&
      !actorFetching &&
      !loadingSuperAdmin &&
      !superAdminAlreadySet &&
      !claimMutation.isPending &&
      !claimMutation.isSuccess &&
      !claimMutation.isError
    ) {
      claimMutation.mutate();
    }
  }, [
    isAuthenticated,
    actor,
    actorFetching,
    loadingSuperAdmin,
    superAdminAlreadySet,
    claimMutation,
  ]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Login failed';
      toast.error(msg);
    }
  };

  const isLoading = loadingSuperAdmin || checkingAdmin || actorFetching;

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-gray-400">Checking admin status...</p>
        </div>
      </div>
    );
  }

  // Current user is already super admin — redirect handled by useEffect above
  if (currentUserIsSuperAdmin || isSuperAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-400" />
          <h2 className="text-2xl font-bold text-green-400">You are the Super Admin</h2>
          <p className="text-gray-400">Redirecting to admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Super admin already assigned to someone else
  if (superAdminAlreadySet && !currentUserIsSuperAdmin) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Alert className="bg-orange-500/10 border-orange-500/30">
          <Info className="h-4 w-4 text-orange-400" />
          <AlertDescription className="text-orange-200">
            <strong>Super Admin Already Assigned.</strong> The super admin role has already been
            claimed. Please contact your super admin for access.
          </AlertDescription>
        </Alert>

        <Card className="bg-gray-800/50 border-orange-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <Shield className="h-6 w-6" />
              Access Restricted
            </CardTitle>
            <CardDescription className="text-gray-400">
              A super admin has already been assigned for this application. Only the super admin can
              grant additional admin privileges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 font-mono break-all">
              Super Admin: {superAdmin?.toString()}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No super admin yet — show login / claim UI
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Alert className="bg-cyan-500/10 border-cyan-500/30">
        <Info className="h-4 w-4 text-cyan-400" />
        <AlertDescription className="text-cyan-200">
          <strong>No Super Admin Assigned Yet.</strong> The first user to log in will automatically
          become the Super Admin with full administrative access.
        </AlertDescription>
      </Alert>

      <Card className="bg-gray-800/50 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Shield className="h-6 w-6" />
            Claim Super Admin
          </CardTitle>
          <CardDescription className="text-gray-400">
            Log in with your Internet Identity to automatically claim the Super Admin role. This
            only works while no super admin has been assigned.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-gray-900/60 border border-cyan-500/20 p-4 space-y-3">
            <h4 className="text-sm font-semibold text-cyan-300">How it works:</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">1.</span>
                Click the button below to log in with Internet Identity.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">2.</span>
                Your account will be automatically assigned as Super Admin.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">3.</span>
                You'll be redirected to the Admin Dashboard immediately.
              </li>
            </ul>
          </div>

          {!isAuthenticated ? (
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold h-12 text-base"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Log In &amp; Claim Super Admin
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900/60 rounded-lg p-3 border border-cyan-500/20">
                <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                <span>
                  Logged in as:{' '}
                  <span className="font-mono text-xs text-cyan-300 break-all">{callerPrincipal}</span>
                </span>
              </div>
              <Button
                onClick={() => claimMutation.mutate()}
                disabled={claimMutation.isPending}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold h-12 text-base"
              >
                {claimMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Claiming Super Admin...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Claim Super Admin
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
