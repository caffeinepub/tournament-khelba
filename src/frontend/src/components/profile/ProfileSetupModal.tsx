import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSetupModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contextMessage?: string;
  onSuccess?: () => void;
}

export default function ProfileSetupModal({ 
  open = false, 
  onOpenChange,
  contextMessage,
  onSuccess 
}: ProfileSetupModalProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  
  const [name, setName] = useState('');
  const [freefireUID, setFreefireUID] = useState('');

  // Pre-fill form if profile exists but is incomplete
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setFreefireUID(userProfile.freeFireUid || '');
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !freefireUID.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await saveProfile.mutateAsync({ 
        name: name.trim(), 
        freeFireUid: freefireUID.trim() 
      });
      toast.success('Profile saved successfully!');
      
      // Reset form
      setName('');
      setFreefireUID('');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal if controlled
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
            {contextMessage ? 'Complete Your Profile' : 'Set Up Your Profile'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {contextMessage || 'Fill in your player details to participate in tournaments'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Player Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="freefireUID" className="text-white">Free Fire UID</Label>
            <Input
              id="freefireUID"
              value={freefireUID}
              onChange={(e) => setFreefireUID(e.target.value)}
              placeholder="Enter your Free Fire UID"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
            <p className="text-xs text-gray-500">
              Your Free Fire UID can be found in your game profile
            </p>
          </div>

          <div className="flex gap-3">
            {onOpenChange && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={saveProfile.isPending}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-gray-900 font-bold"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
