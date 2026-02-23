import { Skeleton } from '@/components/ui/skeleton';
import SkeletonCard from './SkeletonCard';

interface SkeletonLoaderProps {
  type: 'grid' | 'list' | 'dashboard' | 'form';
  count?: number;
}

export default function SkeletonLoader({ type, count = 6 }: SkeletonLoaderProps) {
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} variant="wide" />
        ))}
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} variant="compact" />
          ))}
        </div>
        <div className="bg-gray-900/80 border border-cyan-500/20 rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-1/4 bg-gray-800" />
          <Skeleton className="h-64 w-full bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-800" />
            <Skeleton className="h-10 w-full bg-gray-800 rounded" />
          </div>
        ))}
        <Skeleton className="h-11 w-full bg-gray-800 rounded mt-6" />
      </div>
    );
  }

  return null;
}
