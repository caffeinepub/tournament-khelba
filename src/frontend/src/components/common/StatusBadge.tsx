import { Badge } from '@/components/ui/badge';
import { Clock, Users, Play, CheckCircle } from 'lucide-react';

export type TournamentStatus = 'Open' | 'Full' | 'Started' | 'Completed';

interface StatusBadgeProps {
  status: TournamentStatus;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = {
    Open: {
      color: 'bg-green-500/20 text-green-400 border-green-500/50',
      glow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]',
      icon: Clock,
    },
    Full: {
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      glow: 'shadow-[0_0_10px_rgba(249,115,22,0.3)]',
      icon: Users,
    },
    Started: {
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
      glow: 'shadow-[0_0_10px_rgba(6,182,212,0.3)]',
      icon: Play,
    },
    Completed: {
      color: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
      glow: 'shadow-[0_0_10px_rgba(107,114,128,0.3)]',
      icon: CheckCircle,
    },
  };

  const { color, glow, icon: Icon } = config[status];

  return (
    <Badge className={`${color} ${glow} flex items-center gap-1 ${className}`}>
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}
