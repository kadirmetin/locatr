import { Skeleton } from '@/components/ui/skeleton';

const SessionSkeleton = () => (
  <div className="bg-muted/50 flex flex-col space-y-2 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export default SessionSkeleton;
