import { useParams, Link } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trophy, Users, Clock, Coins, MapPin, Key, ArrowLeft, Info } from 'lucide-react';
import { useRegisterForTournament, useProfileCompleteness, MOCK_TOURNAMENTS } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { useState } from 'react';
import ProfileSetupModal from '../profile/ProfileSetupModal';
import CommentsSection from './CommentsSection';

export default function TournamentDetailPage() {
  const { tournamentId } = useParams({ from: '/tournament/$tournamentId' });
  const { data: isProfileComplete } = useProfileCompleteness();
  const registerMutation = useRegisterForTournament();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const tournament = MOCK_TOURNAMENTS.find(t => t.id === tournamentId);

  if (!tournament) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Tournament not found</p>
        <Link to="/">
          <Button className="mt-4">Back to Tournaments</Button>
        </Link>
      </div>
    );
  }

  const startDate = new Date(tournament.startTime);
  const slotsRemaining = tournament.maxSlots - tournament.registeredPlayers;
  const fillPercentage = (tournament.registeredPlayers / tournament.maxSlots) * 100;
  const isRegistered = false; // Mock data

  const handleRegister = () => {
    if (!isProfileComplete) {
      setShowProfileSetup(true);
      return;
    }

    registerMutation.mutate(tournamentId, {
      onSuccess: () => {
        toast.success('Successfully registered for tournament!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to register');
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tournaments
        </Button>
      </Link>

      <Alert className="bg-orange-500/10 border-orange-500/30">
        <Info className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Demo Mode:</strong> Tournament registration requires backend implementation.
        </AlertDescription>
      </Alert>

      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <div className="h-3 bg-gradient-to-r from-cyan-500 via-green-500 to-cyan-500"></div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 mb-3">
                {tournament.mode}
              </Badge>
              <CardTitle className="text-4xl font-black text-white mb-2">
                {tournament.mode} Tournament
              </CardTitle>
              <p className="text-gray-400">Tournament ID: {tournament.id}</p>
            </div>
            <img 
              src="/assets/generated/trophy-icon.dim_128x128.png" 
              alt="Trophy" 
              className="h-20 w-20"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tournament Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Coins className="h-6 w-6 text-yellow-400" />
                  <span className="text-gray-300">Entry Fee</span>
                </div>
                <span className="text-white font-bold text-xl">৳{tournament.entryFee}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  <span className="text-gray-300">Prize Pool</span>
                </div>
                <span className="text-green-400 font-bold text-xl">৳{tournament.prizePool}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-cyan-400" />
                  <span className="text-gray-300">Start Time</span>
                </div>
                <span className="text-white font-semibold">
                  {startDate.toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-cyan-400" />
                  <span className="text-gray-300">Registered</span>
                </div>
                <span className="text-white font-semibold">
                  {tournament.registeredPlayers}/{tournament.maxSlots}
                </span>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Slots Remaining</span>
                  <span className="text-white font-semibold">{slotsRemaining}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-300"
                    style={{ width: `${fillPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-orange-400" />
                  <span className="text-gray-300">Room ID</span>
                </div>
                <span className="text-white font-mono font-semibold">{tournament.roomId}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-6 w-6 text-orange-400" />
                  <span className="text-gray-300">Password</span>
                </div>
                <span className="text-white font-mono font-semibold">{tournament.roomPassword}</span>
              </div>
            </div>
          </div>

          {/* Registration Button */}
          <div className="pt-4">
            {isRegistered ? (
              <Button disabled className="w-full h-14 text-lg font-bold">
                Already Registered
              </Button>
            ) : slotsRemaining === 0 ? (
              <Button disabled className="w-full h-14 text-lg font-bold">
                Tournament Full
              </Button>
            ) : (
              <Button
                onClick={handleRegister}
                disabled={registerMutation.isPending}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600"
              >
                {registerMutation.isPending ? 'Registering...' : `Register Now - ৳${tournament.entryFee}`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentsSection tournamentId={tournamentId} isRegistered={isRegistered} />

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        open={showProfileSetup}
        onOpenChange={setShowProfileSetup}
        contextMessage="Complete your profile to register for tournaments"
        onSuccess={() => {
          setShowProfileSetup(false);
          handleRegister();
        }}
      />
    </div>
  );
}
