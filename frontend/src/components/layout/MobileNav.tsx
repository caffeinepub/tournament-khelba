import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAdminCheck } from '../../hooks/useAdminCheck';
import { useQueryClient } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Trophy,
  Wallet,
  Bell,
  User,
  Shield,
  LogOut,
  BarChart2,
  Users,
  Gift,
} from 'lucide-react';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const navigate = useNavigate();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { isAdmin } = useAdminCheck();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    onClose();
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      onClose();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navItems = [
    { icon: Trophy, label: 'Tournaments', path: '/' },
    ...(isAuthenticated
      ? [
          { icon: Wallet, label: 'Wallet', path: '/wallet' },
          { icon: Bell, label: 'Notifications', path: '/notifications' },
          { icon: BarChart2, label: 'Statistics', path: '/statistics' },
          { icon: Users, label: 'Squads', path: '/squads' },
          { icon: Gift, label: 'Referrals', path: '/referrals' },
          { icon: User, label: 'Profile', path: '/profile' },
        ]
      : []),
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 bg-card border-border p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <img
              src="/assets/generated/code11-logo.dim_200x60.png"
              alt="Code 11"
              className="h-7 w-auto"
            />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100%-73px)]">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => handleNavigate(path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                {label}
              </button>
            ))}

            {isAdmin && (
              <>
                <Separator className="my-2" />
                <button
                  onClick={() => handleNavigate('/admin')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neon-cyan hover:bg-neon-cyan/10 transition-colors text-left"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </button>
              </>
            )}
          </nav>

          <div className="p-4 border-t border-border">
            {isAuthenticated && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-background/50">
                <p className="text-xs text-muted-foreground truncate">
                  {identity.getPrincipal().toString()}
                </p>
              </div>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              className={`w-full ${
                isAuthenticated
                  ? 'border-destructive/50 text-destructive hover:bg-destructive/10'
                  : 'bg-neon-cyan text-background hover:bg-neon-cyan/90'
              }`}
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </>
              ) : isLoggingIn ? (
                'Logging in...'
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
