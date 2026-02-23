import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Trophy, UserPlus, LogOut, Trash2, Info } from 'lucide-react';
import { useGetCurrentSquad, useGetSquadInvitations } from '../../hooks/useQueries';
import { useState } from 'react';
import CreateSquadModal from './CreateSquadModal';
import InviteMemberModal from './InviteMemberModal';

export default function SquadsPage() {
  const { data: squad, isLoading } = useGetCurrentSquad();
  const { data: invitations } = useGetSquadInvitations();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading squad data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-12 w-12 text-cyan-400" />
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
          My Squad
        </h1>
      </div>

      <Alert className="bg-orange-500/10 border-orange-500/30">
        <Info className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>Demo Mode:</strong> Squad management requires backend implementation. Data shown is sample data.
        </AlertDescription>
      </Alert>

      {/* Squad Invitations */}
      {invitations && invitations.length > 0 && (
        <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white">Squad Invitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {invitations.map((inv: any) => (
              <div key={inv.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-semibold">{inv.squadName}</p>
                  <p className="text-sm text-gray-400">Invited by {inv.invitedBy}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-500 hover:bg-green-600">Accept</Button>
                  <Button size="sm" variant="outline">Decline</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Current Squad or Create Squad */}
      {squad ? (
        <>
          <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-black text-white">
                    {squad.name}
                    <Badge className="ml-3 bg-cyan-500/20 text-cyan-400">[{squad.tag}]</Badge>
                  </CardTitle>
                  <p className="text-gray-400 mt-1">Captain: {squad.captain}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowInviteModal(true)} className="bg-cyan-500 hover:bg-cyan-600">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                  <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Disband
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Squad Performance */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-white">{squad.performance.tournamentsPlayed}</p>
                  <p className="text-sm text-gray-400">Tournaments</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-400">{squad.performance.wins}</p>
                  <p className="text-sm text-gray-400">Wins</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-cyan-400">{squad.performance.winRate}%</p>
                  <p className="text-sm text-gray-400">Win Rate</p>
                </div>
              </div>

              {/* Squad Members */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Squad Members</h3>
                <div className="space-y-3">
                  {squad.members.map((member: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <Users className="h-6 w-6 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{member.name}</p>
                          <p className="text-sm text-gray-400">{member.role} • Joined {member.joinDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{member.stats.wins} wins</p>
                        <p className="text-sm text-gray-400">{member.stats.kills} kills</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
          <CardContent className="py-12 text-center">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Squad Yet</h3>
            <p className="text-gray-400 mb-6">Create a squad to play with your friends in Squad tournaments</p>
            <Button onClick={() => setShowCreateModal(true)} className="bg-cyan-500 hover:bg-cyan-600">
              <UserPlus className="h-4 w-4 mr-2" />
              Create Squad
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateSquadModal open={showCreateModal} onOpenChange={setShowCreateModal} />
      <InviteMemberModal open={showInviteModal} onOpenChange={setShowInviteModal} />
    </div>
  );
}
