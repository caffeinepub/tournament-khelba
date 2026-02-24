import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useActor } from './hooks/useActor';
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

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();

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
