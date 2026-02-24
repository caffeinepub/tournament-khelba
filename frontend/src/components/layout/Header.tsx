import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAdminCheck } from '../../hooks/useAdminCheck';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Shield, LogOut, User, Wallet, Bell, Trophy } from 'lucide-react';
import MobileNav from './MobileNav';

export default function Header() {
  const navigate = useNavigate();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { isAdmin } = useAdminCheck();
  const queryClient = useQueryClient();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
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

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigate('/')}
          >
            <img
              src="/assets/generated/code11-logo.dim_200x60.png"
              alt="Code 11"
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  onClick={() => handleNavigate('/')}
                >
                  <Trophy className="w-4 h-4 mr-1" />
                  Tournaments
                </NavigationMenuLink>
              </NavigationMenuItem>

              {isAuthenticated && (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      onClick={() => handleNavigate('/wallet')}
                    >
                      <Wallet className="w-4 h-4 mr-1" />
                      Wallet
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      onClick={() => handleNavigate('/notifications')}
                    >
                      <Bell className="w-4 h-4 mr-1" />
                      Notifications
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              )}

              {isAdmin && (
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} text-neon-cyan`}
                    onClick={() => handleNavigate('/admin')}
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Admin Panel
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/assets/generated/default-avatar.dim_200x200.png" />
                      <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xs">
                        {identity.getPrincipal().toString().slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-muted-foreground truncate">
                      {identity.getPrincipal().toString()}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate('/wallet')}>
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleNavigate('/admin')}>
                        <Shield className="w-4 h-4 mr-2 text-neon-cyan" />
                        <span className="text-neon-cyan">Admin Panel</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAuth} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-semibold"
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
