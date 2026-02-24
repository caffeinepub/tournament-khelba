import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Trophy, Wallet, User, BarChart3, Shield, Users, TrendingUp, Gift, Bell } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAdminCheck } from '../../hooks/useQueries';
import { Badge } from '@/components/ui/badge';

interface MobileNavProps {
  unreadCount?: number;
}

export default function MobileNav({ unreadCount = 0 }: MobileNavProps) {
  const { isAdmin } = useAdminCheck();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-gray-900 border-cyan-500/30 w-72">
        <SheetHeader>
          <SheetTitle className="text-left">
            <img 
              src="/assets/generated/tournament-khelba-logo.dim_400x120.png" 
              alt="Tournament Khelba" 
              className="h-10"
            />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-8">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start h-12 text-base">
              <Trophy className="h-5 w-5 mr-3" />
              Tournaments
            </Button>
          </Link>
          <Link to="/wallet">
            <Button variant="ghost" className="w-full justify-start h-12 text-base">
              <Wallet className="h-5 w-5 mr-3" />
              Wallet
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="ghost" className="w-full justify-start h-12 text-base">
              <User className="h-5 w-5 mr-3" />
              Profile
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="ghost" className="w-full justify-start h-12 text-base">
              <BarChart3 className="h-5 w-5 mr-3" />
              Leaderboard
            </Button>
          </Link>
          
          <div className="border-t border-cyan-500/20 my-2" />
          
          <Link to="/notifications">
            <Button variant="ghost" className="w-full justify-start h-12 text-base relative">
              <Bell className="h-5 w-5 mr-3" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link to="/squads">
            <Button variant="ghost" className="w-full justify-start h-12 text-base">
              <Users className="h-5 w-5 mr-3" />
              My Squad
            </Button>
          </Link>
          <Link to="/statistics">
            <Button variant="ghost" className="w-full justify-start h-12 text-base">
              <TrendingUp className="h-5 w-5 mr-3" />
              Statistics
            </Button>
          </Link>
          <Link to="/referrals">
            <Button variant="ghost" className="w-full justify-start h-12 text-base">
              <Gift className="h-5 w-5 mr-3" />
              Referrals
            </Button>
          </Link>
          
          {isAdmin && (
            <>
              <div className="border-t border-cyan-500/20 my-2" />
              <Link to="/admin">
                <Button variant="ghost" className="w-full justify-start h-12 text-base text-orange-400">
                  <Shield className="h-5 w-5 mr-3" />
                  Admin Panel
                </Button>
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
