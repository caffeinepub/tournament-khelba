import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const MOCK_USERS = [
  { id: '1', name: 'ProGamer', freefireUID: '1234567890', tournamentsPlayed: 15 },
  { id: '2', name: 'FireKing', freefireUID: '0987654321', tournamentsPlayed: 12 },
  { id: '3', name: 'SquadLeader', freefireUID: '1122334455', tournamentsPlayed: 18 },
];

export default function UserManagementPanel() {
  return (
    <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-white">Registered Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_USERS.map((user) => (
            <div 
              key={user.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-cyan-500/50">
                  <AvatarImage src="/assets/generated/default-avatar.dim_200x200.png" />
                  <AvatarFallback className="bg-gray-800 text-cyan-400 font-bold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-bold">{user.name}</p>
                  <p className="text-sm text-gray-400">Free Fire UID: {user.freefireUID}</p>
                </div>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                {user.tournamentsPlayed} tournaments
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
