import { Link } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Clock, Coins } from 'lucide-react';
import { Tournament } from '../../hooks/useQueries';

interface TournamentCardProps {
  tournament: Tournament;
  isPracticeMode?: boolean;
}

export default function TournamentCard({ tournament, isPracticeMode }: TournamentCardProps) {
  const slotsRemaining = tournament.maxSlots - tournament.registeredPlayers;
  const fillPercentage = (tournament.registeredPlayers / tournament.maxSlots) * 100;
  const startDate = new Date(tournament.startTime);

  const getModeColor = (mode: string) => {
    if (isPracticeMode) return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    switch (mode) {
      case 'Solo': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'Duo': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Squad': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const borderColor = isPracticeMode 
    ? 'border-blue-500/30 hover:border-blue-500/60' 
    : 'border-cyan-500/30 hover:border-cyan-500/60';

  return (
    <Card className={`bg-gray-900/80 border-2 ${borderColor} transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] overflow-hidden group`}>
      <div className={`h-2 ${isPracticeMode ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-cyan-500 via-green-500 to-cyan-500'}`}></div>
      
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge className={`${getModeColor(tournament.mode)} font-bold`}>
            {tournament.mode}
          </Badge>
          {isPracticeMode ? (
            <img 
              src="/assets/generated/practice-badge.dim_48x48.png" 
              alt="Practice" 
              className="h-8 w-8 opacity-80 group-hover:opacity-100 transition-opacity"
            />
          ) : (
            <img 
              src="/assets/generated/trophy-icon.dim_128x128.png" 
              alt="Trophy" 
              className="h-8 w-8 opacity-80 group-hover:opacity-100 transition-opacity"
            />
          )}
        </div>
        <CardTitle className="text-2xl font-black text-white">
          {isPracticeMode ? `${tournament.mode} Practice` : `${tournament.mode} Tournament`}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Coins className="h-4 w-4 text-yellow-400" />
            <span>Entry Fee</span>
          </div>
          <span className="text-white font-bold">
            {isPracticeMode ? '0 BDT (Practice)' : `৳${tournament.entryFee}`}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span>Prize Pool</span>
          </div>
          <span className={isPracticeMode ? 'text-gray-400' : 'text-green-400 font-bold'}>
            {isPracticeMode ? 'No Prize Pool' : `৳${tournament.prizePool}`}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>Starts</span>
          </div>
          <span className="text-white font-semibold">
            {startDate.toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="h-4 w-4 text-cyan-400" />
              <span>Slots</span>
            </div>
            <span className="text-white font-semibold">
              {tournament.registeredPlayers}/{tournament.maxSlots}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full ${isPracticeMode ? 'bg-blue-500' : 'bg-gradient-to-r from-cyan-500 to-green-500'} transition-all duration-300`}
              style={{ width: `${fillPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {slotsRemaining} slots remaining
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Link to="/tournament/$tournamentId" params={{ tournamentId: tournament.id }} className="w-full">
          <Button className={`w-full ${isPracticeMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600'} text-white font-bold`}>
            {isPracticeMode ? 'Join Practice' : 'View Details'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
