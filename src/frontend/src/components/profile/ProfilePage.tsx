import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Target, Zap, TrendingUp, Edit2, Info } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [freefireUID, setFreefireUID] = useState('1234567890');

  // Mock data
  const mockProfile = {
    name: 'ProGamer',
    freefireUID: '1234567890',
    stats: {
      tournamentsPlayed: 15,
      wins: 3,
      totalKills: 127,
      rank: 42,
      points: 1850,
    },
    recentTournaments: [
      { id: '1', name: 'Solo Tournament #5', date: '2 days ago', result: '1st Place', prize: 500 },
      { id: '2', name: 'Duo Tournament #3', date: '5 days ago', result: '4th Place', prize: 0 },
      { id: '3', name: 'Squad Tournament #2', date: '1 week ago', result: '2nd Place', prize: 300 },
    ],
  };

  const handleSave = () => {
    toast.info('Backend profile update not yet implemented');
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Alert className="bg-orange-500/10 border-orange-500/30">
        <Info className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Demo Mode:</strong> Profile data is stored locally. Backend profile management not yet implemented.
        </AlertDescription>
      </Alert>

      {/* Profile Header */}
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-cyan-500/50">
              <AvatarImage src="/assets/generated/default-avatar.dim_200x200.png" />
              <AvatarFallback className="bg-gray-800 text-2xl font-bold text-cyan-400">
                {mockProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-white mb-2">{mockProfile.name}</h1>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-gray-400 text-sm">Free Fire UID:</Label>
                  {isEditing ? (
                    <Input
                      value={freefireUID}
                      onChange={(e) => setFreefireUID(e.target.value)}
                      className="w-48 h-8 bg-gray-800 border-gray-700 text-white"
                    />
                  ) : (
                    <span className="text-white font-mono">{mockProfile.freefireUID}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-gray-400 text-sm">Leaderboard Rank:</Label>
                  <span className="text-cyan-400 font-bold">#{mockProfile.stats.rank}</span>
                </div>
              </div>
              <div className="mt-4">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" className="bg-green-500 hover:bg-green-600">
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} size="sm" variant="outline">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} size="sm" variant="outline" className="border-cyan-500/30">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border-cyan-500/30">
          <CardContent className="pt-6 text-center">
            <Target className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{mockProfile.stats.tournamentsPlayed}</p>
            <p className="text-sm text-gray-400">Tournaments</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/10 border-green-500/30">
          <CardContent className="pt-6 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{mockProfile.stats.wins}</p>
            <p className="text-sm text-gray-400">Wins</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 border-orange-500/30">
          <CardContent className="pt-6 text-center">
            <Zap className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{mockProfile.stats.totalKills}</p>
            <p className="text-sm text-gray-400">Total Kills</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 border-purple-500/30">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{mockProfile.stats.points}</p>
            <p className="text-sm text-gray-400">Points</p>
          </CardContent>
        </Card>
      </div>

      {/* Tournament History */}
      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white">Recent Tournaments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockProfile.recentTournaments.map((tournament) => (
              <div 
                key={tournament.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div>
                  <p className="text-white font-semibold">{tournament.name}</p>
                  <p className="text-sm text-gray-400">{tournament.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{tournament.result}</p>
                  {tournament.prize > 0 && (
                    <p className="text-sm text-green-400">+৳{tournament.prize}</p>
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
