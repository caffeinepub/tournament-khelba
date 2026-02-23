import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_TOURNAMENTS } from '../../hooks/useQueries';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TournamentManagementPanel() {
  const [showForm, setShowForm] = useState(false);

  const handleCreate = () => {
    toast.info('Backend tournament creation not yet implemented');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/80 border-2 border-orange-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Create Tournament</CardTitle>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Tournament
            </Button>
          </div>
        </CardHeader>
        {showForm && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mode" className="text-white">Game Mode</Label>
                <Select>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Solo">Solo</SelectItem>
                    <SelectItem value="Duo">Duo</SelectItem>
                    <SelectItem value="Squad">Squad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryFee" className="text-white">Entry Fee (৳)</Label>
                <Input
                  id="entryFee"
                  type="number"
                  placeholder="50"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prizePool" className="text-white">Prize Pool (৳)</Label>
                <Input
                  id="prizePool"
                  type="number"
                  placeholder="1000"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSlots" className="text-white">Max Slots</Label>
                <Input
                  id="maxSlots"
                  type="number"
                  placeholder="100"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-white">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomId" className="text-white">Room ID</Label>
                <Input
                  id="roomId"
                  placeholder="FF-SOLO-001"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="roomPassword" className="text-white">Room Password</Label>
                <Input
                  id="roomPassword"
                  placeholder="PASS123"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <Button onClick={handleCreate} className="w-full bg-green-500 hover:bg-green-600">
              Create Tournament
            </Button>
          </CardContent>
        )}
      </Card>

      <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white">Existing Tournaments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_TOURNAMENTS.map((tournament) => (
              <div 
                key={tournament.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div>
                  <p className="text-white font-bold">{tournament.mode} Tournament</p>
                  <p className="text-sm text-gray-400">
                    {tournament.registeredPlayers}/{tournament.maxSlots} players • ৳{tournament.prizePool} prize
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-cyan-500/30">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
