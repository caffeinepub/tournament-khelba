import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateSquad } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface CreateSquadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateSquadModal({ open, onOpenChange }: CreateSquadModalProps) {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const createSquad = useCreateSquad();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !tag.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (tag.length < 2 || tag.length > 5) {
      toast.error('Tag must be 2-5 characters');
      return;
    }

    createSquad.mutate(
      { name: name.trim(), tag: tag.trim().toUpperCase() },
      {
        onSuccess: () => {
          toast.success('Squad created successfully!');
          setName('');
          setTag('');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Failed to create squad');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
            Create Squad
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Create your squad to compete in Squad tournaments with your friends
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="squadName" className="text-white">Squad Name</Label>
            <Input
              id="squadName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter squad name"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="squadTag" className="text-white">Squad Tag (2-5 characters)</Label>
            <Input
              id="squadTag"
              value={tag}
              onChange={(e) => setTag(e.target.value.toUpperCase())}
              placeholder="e.g., EW"
              className="bg-gray-800 border-gray-700 text-white"
              maxLength={5}
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
              disabled={createSquad.isPending}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-gray-900 font-bold"
            >
              {createSquad.isPending ? 'Creating...' : 'Create Squad'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
