import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useInviteSquadMember } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InviteMemberModal({ open, onOpenChange }: InviteMemberModalProps) {
  const [playerName, setPlayerName] = useState('');
  const inviteMember = useInviteSquadMember();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName.trim()) {
      toast.error('Please enter a player name');
      return;
    }

    inviteMember.mutate(playerName.trim(), {
      onSuccess: () => {
        toast.success('Invitation sent successfully!');
        setPlayerName('');
        onOpenChange(false);
      },
      onError: () => {
        toast.error('Failed to send invitation');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
            Invite Squad Member
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the player name or Free Fire UID to send an invitation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-white">Player Name or UID</Label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name or Free Fire UID"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={inviteMember.isPending}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-gray-900 font-bold"
            >
              {inviteMember.isPending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
