import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { Trophy, Users, Clock, Coins, User } from 'lucide-react';
import StatusBadge, { TournamentStatus } from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import { formatCurrency, formatSlots, isLowSlots, isUrgentDeadline } from '../../utils/formatters';
import { useCountdown } from '../../hooks/useCountdown';

interface TournamentCardProps {
  tournament: {
    id: string;
    mode: string;
    entryFee: number;
    prizePool: number;
    maxSlots: number;
    registeredPlayers: number;
    startTime: string;
    registrationDeadline?: string;
    isFeatured?: boolean;
    isPractice?: boolean;
  };
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const slotsRemaining = tournament.maxSlots - tournament.registeredPlayers;
  const fillPercentage = (tournament.registeredPlayers / tournament.maxSlots) * 100;
  const deadline = tournament.registrationDeadline || tournament.startTime;
  const countdown = useCountdown(deadline);
  
  const getStatus = (): TournamentStatus => {
    if (slotsRemaining === 0) return 'Full';
    const now = new Date();
    const start = new Date(tournament.startTime);
    if (start < now) return 'Started';
    return 'Open';
  };

  const status = getStatus();
  const lowSlots = isLowSlots(tournament.registeredPlayers, tournament.maxSlots);
  const urgentDeadline = isUrgentDeadline(deadline);

  const getModeIcon = () => {
    switch (tournament.mode) {
      case 'Solo': return <User className="h-4 w-4" />;
      case 'Duo': return <Users className="h-4 w-4" />;
      case 'Squad': return <Users className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  return (
    <Link to="/tournament/$tournamentId" params={{ tournamentId: tournament.id }}>
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:scale-[1.02] cursor-pointer h-full">
        <div className="h-3 bg-gradient-to-r from-cyan-500 via-green-500 to-cyan-500"></div>
        <CardHeader className="relative pb-3">
          <div className="absolute top-4 right-4">
            <StatusBadge status={status} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
              {getModeIcon()}
              <span className="text-sm font-semibold">{tournament.mode}</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-black text-white">
            {tournament.mode} Tournament
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* Prize Pool - Prominent Display */}
          <div className="bg-gradient-to-r from-green-500/20 to-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-400" />
                <span className="text-gray-300 text-sm">Prize Pool</span>
              </div>
              <span className="text-3xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                {formatCurrency(tournament.prizePool)}
              </span>
            </div>
          </div>

          {/* Entry Fee */}
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-300 text-sm">Entry Fee</span>
            </div>
            <span className="text-white font-bold text-lg">{formatCurrency(tournament.entryFee)}</span>
          </div>

          {/* Slot Availability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Slots</span>
              <span className={`font-semibold ${lowSlots ? 'text-orange-400' : 'text-white'}`}>
                {formatSlots(tournament.registeredPlayers, tournament.maxSlots)}
              </span>
            </div>
            <ProgressBar value={tournament.registeredPlayers} max={tournament.maxSlots} />
          </div>

          {/* Registration Deadline */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${urgentDeadline ? 'bg-red-500/10 border border-red-500/30' : 'bg-gray-800/50'}`}>
            <div className="flex items-center gap-2">
              <Clock className={`h-5 w-5 ${urgentDeadline ? 'text-red-400' : 'text-cyan-400'}`} />
              <span className={`text-sm ${urgentDeadline ? 'text-red-300' : 'text-gray-300'}`}>
                {urgentDeadline ? 'Closing Soon' : 'Registration'}
              </span>
            </div>
            <span className={`font-semibold ${urgentDeadline ? 'text-red-400' : 'text-white'}`}>
              {countdown}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
