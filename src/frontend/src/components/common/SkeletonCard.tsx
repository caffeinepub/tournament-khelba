import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonCardProps {
  variant?: 'default' | 'compact' | 'wide';
}

export default function SkeletonCard({ variant = 'default' }: SkeletonCardProps) {
  if (variant === 'compact') {
    return (
      <div className="bg-gray-900/80 border border-cyan-500/20 rounded-lg p-4 space-y-3">
        <Skeleton className="h-4 w-3/4 bg-gray-800" />
        <Skeleton className="h-3 w-1/2 bg-gray-800" />
        <Skeleton className="h-8 w-full bg-gray-800" />
      </div>
    );
  }

  if (variant === 'wide') {
    return (
      <div className="bg-gray-900/80 border border-cyan-500/20 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-1/3 bg-gray-800" />
          <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
        </div>
        <Skeleton className="h-4 w-full bg-gray-800" />
        <Skeleton className="h-4 w-2/3 bg-gray-800" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 bg-gray-800 rounded" />
          <Skeleton className="h-12 bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 border border-cyan-500/20 rounded-lg overflow-hidden">
      <Skeleton className="h-3 w-full bg-gradient-to-r from-cyan-500/20 to-green-500/20" />
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-20 bg-gray-800" />
            <Skeleton className="h-6 w-3/4 bg-gray-800" />
          </div>
          <Skeleton className="h-12 w-12 rounded bg-gray-800" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-gray-800" />
          <Skeleton className="h-4 w-5/6 bg-gray-800" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 bg-gray-800 rounded" />
          <Skeleton className="h-10 bg-gray-800 rounded" />
        </div>
        <Skeleton className="h-12 w-full bg-gray-800 rounded" />
      </div>
    </div>
  );
}
