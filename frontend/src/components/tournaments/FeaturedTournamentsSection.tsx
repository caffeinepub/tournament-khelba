import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Clock, Coins, Star } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tournament } from '../../hooks/useQueries';

interface FeaturedTournamentsSectionProps {
  tournaments: Tournament[];
}

export default function FeaturedTournamentsSection({ tournaments }: FeaturedTournamentsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Star className="h-8 w-8 text-yellow-400" />
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
          Featured Tournaments
        </h2>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-6 pb-4">
          {tournaments.map((tournament) => {
            const startDate = new Date(tournament.startTime);
            const slotsRemaining = tournament.maxSlots - tournament.registeredPlayers;

            return (
              <Card
                key={tournament.id}
                className="inline-block w-[400px] bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border-4 border-yellow-500/50 hover:border-yellow-500/80 transition-all duration-300 hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <img
                    src="/assets/generated/featured-badge.dim_48x48.png"
                    alt="Featured"
                    className="h-12 w-12 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                  />
                </div>

                {tournament.sponsor && (
                  <div className="absolute top-4 left-4 bg-gray-900/80 px-3 py-1 rounded-full">
                    <p className="text-xs text-yellow-400 font-semibold">Sponsored by {tournament.sponsor}</p>
                  </div>
                )}

                <div className="h-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500"></div>

                <CardContent className="pt-16 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-yellow-500/30 text-yellow-400 border-yellow-500/50 font-bold text-lg px-4 py-1">
                      {tournament.mode}
                    </Badge>
                    <Trophy className="h-10 w-10 text-yellow-400" />
                  </div>

                  <h3 className="text-2xl font-black text-white">
                    {tournament.mode} Championship
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Coins className="h-5 w-5 text-yellow-400" />
                        <span>Entry Fee</span>
                      </div>
                      <span className="text-white font-bold text-lg">৳{tournament.entryFee}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        <span>Prize Pool</span>
                      </div>
                      <span className="text-yellow-400 font-black text-xl">৳{tournament.prizePool}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="h-5 w-5 text-cyan-400" />
                        <span>Starts</span>
                      </div>
                      <span className="text-white font-semibold">
                        {startDate.toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Users className="h-5 w-5 text-cyan-400" />
                        <span>Slots</span>
                      </div>
                      <span className="text-white font-semibold">
                        {tournament.registeredPlayers}/{tournament.maxSlots}
                      </span>
                    </div>
                  </div>

                  <Link to="/tournament/$tournamentId" params={{ tournamentId: tournament.id }}>
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold text-lg h-12">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
