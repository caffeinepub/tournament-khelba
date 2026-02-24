import { useParams, Link } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Target, ArrowLeft, Info } from 'lucide-react';

const MOCK_RESULTS = [
  { rank: 1, playerName: 'ProGamer', kills: 15, prize: 500 },
  { rank: 2, playerName: 'FireKing', kills: 12, prize: 300 },
  { rank: 3, playerName: 'SquadLeader', kills: 10, prize: 150 },
  { rank: 4, playerName: 'SniperElite', kills: 9, prize: 50 },
  { rank: 5, playerName: 'RushMaster', kills: 8, prize: 0 },
];

export default function TournamentResultsPage() {
  const { tournamentId } = useParams({ from: '/results/$tournamentId' });

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/30 to-yellow-500/10 border-yellow-500/50';
      case 2:
        return 'bg-gradient-to-r from-gray-400/30 to-gray-400/10 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-orange-500/30 to-orange-500/10 border-orange-500/50';
      default:
        return 'bg-gray-800/50 border-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/">
        <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tournaments
        </Button>
      </Link>

      <div className="flex items-center gap-3">
        <Trophy className="h-12 w-12 text-yellow-400" />
        <h1 className="text-4xl font-black text-white">
          Tournament Results
        </h1>
      </div>

      <Alert className="bg-orange-500/10 border-orange-500/30">
        <Info className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Demo Mode:</strong> Tournament results are sample data. Backend results system not yet implemented.
        </AlertDescription>
      </Alert>

      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white">Final Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_RESULTS.map((result) => (
              <div 
                key={result.rank}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${getRankBg(result.rank)}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 text-center">
                    {result.rank <= 3 ? (
                      <Trophy className={`h-8 w-8 mx-auto ${
                        result.rank === 1 ? 'text-yellow-400' : 
                        result.rank === 2 ? 'text-gray-400' : 
                        'text-orange-400'
                      }`} />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">#{result.rank}</span>
                    )}
                  </div>
                  <Avatar className="h-14 w-14 border-2 border-cyan-500/50">
                    <AvatarImage src="/assets/generated/default-avatar.dim_200x200.png" />
                    <AvatarFallback className="bg-gray-800 text-cyan-400 font-bold text-lg">
                      {result.playerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-bold text-xl">{result.playerName}</p>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">{result.kills} kills</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {result.prize > 0 ? (
                    <>
                      <p className="text-2xl font-black text-green-400">৳{result.prize}</p>
                      <p className="text-xs text-gray-400">prize</p>
                    </>
                  ) : (
                    <p className="text-gray-500">No prize</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
