import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, MapPin, Key } from 'lucide-react';
import { toast } from 'sonner';

interface RegistrationSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentName: string;
  startTime: string;
  roomId: string;
  roomPassword: string;
}

export default function RegistrationSuccessModal({
  open,
  onOpenChange,
  tournamentName,
  startTime,
  roomId,
  roomPassword,
}: RegistrationSuccessModalProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
            Registration Successful!
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            You're all set for {tournamentName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/20">
            <p className="text-sm text-gray-400 mb-1">Tournament Starts</p>
            <p className="text-white font-semibold text-lg">{startTime}</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-cyan-400" />
                <p className="text-sm text-gray-400">Room ID</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(roomId, 'Room ID')}
                className="hover:bg-cyan-500/10"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-white font-mono font-bold text-2xl tracking-wider">{roomId}</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-orange-400" />
                <p className="text-sm text-gray-400">Password</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(roomPassword, 'Password')}
                className="hover:bg-orange-500/10"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-white font-mono font-bold text-2xl tracking-wider">{roomPassword}</p>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-green-200 text-sm text-center">
              Save these details! You'll need them to join the tournament.
            </p>
          </div>

          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 font-bold"
          >
            Got It!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
