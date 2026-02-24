import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useActor } from './hooks/useActor';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AppLayout from './components/layout/AppLayout';
import TournamentDashboard from './components/tournaments/TournamentDashboard';
import TournamentDetailPage from './components/tournaments/TournamentDetailPage';
import WalletPage from './components/wallet/WalletPage';
import ProfilePage from './components/profile/ProfilePage';
import LeaderboardPage from './components/leaderboard/LeaderboardPage';
import TournamentResultsPage from './components/results/TournamentResultsPage';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginPage from './components/auth/LoginPage';
import NotificationsPage from './components/notifications/NotificationsPage';
import StatisticsDashboard from './components/statistics/StatisticsDashboard';
import SquadsPage from './components/squads/SquadsPage';
import ReferralDashboard from './components/referral/ReferralDashboard';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { toast } from 'sonner';

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const claimAttemptedRef = useRef(false);

  // After login + actor ready, silently attempt to claim super admin
  // if none exists yet. This is a fire-and-forget operation.
  useEffect(() => {
    if (!identity || !actor || actorFetching || claimAttemptedRef.current) return;

    claimAttemptedRef.current = true;

    const attemptClaim = async () => {
      try {
        // Check if super admin already exists (query — fast)
        const existingSuperAdmin = await actor.getSuperAdmin();
        if (existingSuperAdmin !== null) {
          // Super admin already set — nothing to do
          return;
        }

        // No super admin yet — attempt to claim by calling addAdmin with own principal
        const callerPrincipal = identity.getPrincipal();
        await actor.addAdmin(callerPrincipal);

        // Invalidate admin-related queries so UI refreshes immediately
        queryClient.invalidateQueries({ queryKey: ['superAdmin'] });
        queryClient.invalidateQueries({ queryKey: ['admins'] });
        queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
        queryClient.invalidateQueries({ queryKey: ['isSuperAdmin'] });

        toast.success('You have been assigned as Super Admin!', {
          description: 'You now have full administrative access.',
          duration: 5000,
        });
      } catch {
        // Silently swallow — super admin may have been set by a concurrent call
      }
    };

    attemptClaim();
  }, [identity, actor, actorFetching, queryClient]);

  if (isInitializing || actorFetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading Tournament Khelba...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TournamentDashboard,
});

const tournamentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tournament/$tournamentId',
  component: TournamentDetailPage,
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallet',
  component: WalletPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results/$tournamentId',
  component: TournamentResultsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: NotificationsPage,
});

const statisticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/statistics',
  component: StatisticsDashboard,
});

const squadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/squads',
  component: SquadsPage,
});

const referralsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referrals',
  component: ReferralDashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  tournamentDetailRoute,
  walletRoute,
  profileRoute,
  leaderboardRoute,
  resultsRoute,
  adminRoute,
  notificationsRoute,
  statisticsRoute,
  squadsRoute,
  referralsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
