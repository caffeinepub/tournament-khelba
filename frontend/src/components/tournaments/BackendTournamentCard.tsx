import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { Trophy, Users, Clock, Coins, User } from 'lucide-react';
import type { Tournament } from '../../backend';

interface BackendTournamentCardProps {
  tournament: Tournament;
}

function formatCurrency(amount: bigint): string {
  return `৳${amount.toString()}`;
}

function getTimeUntil(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  const now = Date.now();
  const diff = ms - now;

  if (diff <= 0) return 'Started';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes}m`;
}

function getModeIcon(gameType: string) {
  switch (gameType) {
    case 'Solo': return <User className="h-4 w-4" />;
    case 'Duo':
    case 'Squad': return <Users className="h-4 w-4" />;
    default: return <Trophy className="h-4 w-4" />;
  }
}

export default function BackendTournamentCard({ tournament }: BackendTournamentCardProps) {
  const startMs = Number(tournament.startDate) / 1_000_000;
  const isStarted = startMs < Date.now();
  const timeUntil = getTimeUntil(tournament.startDate);
  const isUrgent = !isStarted && (startMs - Date.now()) < 2 * 60 * 60 * 1000;

  return (
    <Link to="/tournament/$tournamentId" params={{ tournamentId: tournament.id.toString() }}>
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:scale-[1.02] cursor-pointer h-full">
        <div className="h-3 bg-gradient-to-r from-cyan-500 via-green-500 to-cyan-500"></div>
        <CardHeader className="relative pb-3">
          <div className="absolute top-4 right-4">
            <span className={`text-xs px-2 py-1 rounded font-semibold ${
              isStarted
                ? 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                : 'bg-green-500/20 text-green-400 border border-green-500/50'
            }`}>
              {isStarted ? 'Started' : 'Open'}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
              {getModeIcon(tournament.gameType)}
              <span className="text-sm font-semibold">{tournament.gameType}</span>
            </div>
          </div>
          <CardTitle className="text-xl font-black text-white pr-16 leading-tight">
            {tournament.name}
          </CardTitle>
          {tournament.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{tournament.description}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* Prize Pool */}
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

          {/* Max Participants */}
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              <span className="text-gray-300 text-sm">Max Players</span>
            </div>
            <span className="text-white font-semibold">{tournament.maxParticipants.toString()}</span>
          </div>

          {/* Start Time */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            isUrgent ? 'bg-red-500/10 border border-red-500/30' : 'bg-gray-800/50'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className={`h-5 w-5 ${isUrgent ? 'text-red-400' : 'text-cyan-400'}`} />
              <span className={`text-sm ${isUrgent ? 'text-red-300' : 'text-gray-300'}`}>
                {isStarted ? 'Started' : isUrgent ? 'Starting Soon' : 'Starts In'}
              </span>
            </div>
            <span className={`font-semibold ${isUrgent ? 'text-red-400' : 'text-white'}`}>
              {timeUntil}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
