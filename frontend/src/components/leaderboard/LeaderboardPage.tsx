import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Info } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'ProGamer', points: 2850, wins: 8, avatar: null },
  { rank: 2, name: 'FireKing', points: 2650, wins: 7, avatar: null },
  { rank: 3, name: 'SquadLeader', points: 2400, wins: 6, avatar: null },
  { rank: 4, name: 'SniperElite', points: 2200, wins: 5, avatar: null },
  { rank: 5, name: 'RushMaster', points: 2100, wins: 5, avatar: null },
  { rank: 6, name: 'TacticalPro', points: 1950, wins: 4, avatar: null },
  { rank: 7, name: 'BattleChamp', points: 1850, wins: 4, avatar: null },
  { rank: 8, name: 'VictorySeeker', points: 1750, wins: 3, avatar: null },
  { rank: 9, name: 'CombatKing', points: 1650, wins: 3, avatar: null },
  { rank: 10, name: 'WarriorX', points: 1550, wins: 2, avatar: null },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-400" />;
      default:
        return <span className="text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 border-yellow-500/50';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-400/10 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-orange-500/20 to-orange-500/10 border-orange-500/50';
      default:
        return 'bg-gray-800/50 border-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-12 w-12 text-yellow-400" />
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
          Leaderboard
        </h1>
      </div>

      <Alert className="bg-orange-500/10 border-orange-500/30">
        <Info className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Demo Mode:</strong> Leaderboard data is sample data. Backend leaderboard system not yet implemented.
        </AlertDescription>
      </Alert>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
        <TabsList className="bg-gray-800 border border-cyan-500/30 w-full">
          <TabsTrigger value="daily" className="flex-1 data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900">
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1 data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900">
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1 data-[state=active]:bg-cyan-500 data-[state=active]:text-gray-900">
            Monthly
          </TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="mt-6">
          <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white capitalize">{period} Top Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_LEADERBOARD.map((player) => (
                  <div 
                    key={player.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${getRankBg(player.rank)} transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 flex items-center justify-center">
                        {getRankIcon(player.rank)}
                      </div>
                      <Avatar className="h-12 w-12 border-2 border-cyan-500/50">
                        <AvatarImage src="/assets/generated/default-avatar.dim_200x200.png" />
                        <AvatarFallback className="bg-gray-800 text-cyan-400 font-bold">
                          {player.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-bold text-lg">{player.name}</p>
                        <p className="text-sm text-gray-400">{player.wins} wins</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-cyan-400">{player.points}</p>
                      <p className="text-xs text-gray-400">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
