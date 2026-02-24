import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAdminCheck, useGetUnreadNotificationCount } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { Trophy, Wallet, User, BarChart3, Shield, LogOut, Bell, Users, TrendingUp, Gift } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const { clear, identity } = useInternetIdentity();
  const { isAdmin } = useAdminCheck();
  const unreadCount = useGetUnreadNotificationCount();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <header className="border-b border-cyan-500/20 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,255,255,0.1)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/assets/generated/tournament-khelba-logo.dim_400x120.png" 
              alt="Tournament Khelba" 
              className="h-12 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Tournaments
            </Link>
            <Link 
              to="/leaderboard" 
              className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Leaderboard
            </Link>
            <Link 
              to="/squads" 
              className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              My Squad
            </Link>
            <Link 
              to="/wallet" 
              className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors flex items-center gap-2"
            >
              <Wallet className="h-4 w-4" />
              Wallet
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/code11-logo.dim_200x60.png" 
              alt="Code 11" 
              className="h-8 hidden sm:block"
            />
            
            {identity && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate({ to: '/notifications' })}
                  className="relative hover:bg-cyan-500/10"
                >
                  <Bell className="h-5 w-5 text-gray-300" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/10">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 border-cyan-500/30">
                    <DropdownMenuItem onClick={() => navigate({ to: '/profile' })} className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/statistics' })} className="cursor-pointer">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Statistics
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/referrals' })} className="cursor-pointer">
                      <Gift className="h-4 w-4 mr-2" />
                      Referrals
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/wallet' })} className="cursor-pointer">
                      <Wallet className="h-4 w-4 mr-2" />
                      My Wallet
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-cyan-500/20" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
