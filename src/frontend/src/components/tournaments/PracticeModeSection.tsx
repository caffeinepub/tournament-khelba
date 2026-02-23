import TournamentCard from './TournamentCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Target } from 'lucide-react';
import { Tournament } from '../../hooks/useQueries';

interface PracticeModeSectionProps {
  matches: Tournament[];
}

export default function PracticeModeSection({ matches }: PracticeModeSectionProps) {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-500/10 border-blue-500/30">
        <Target className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200">
          <strong>Practice Mode:</strong> Zero entry fee matches to test your skills. No prizes, but great for practice!
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <TournamentCard key={match.id} tournament={match} isPracticeMode />
        ))}
        {matches.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No practice matches available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
