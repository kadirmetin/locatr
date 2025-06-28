import { Skeleton } from '@/components/ui/skeleton';

const ActivityItemSkeleton = () => (
  <div className="flex items-center space-x-4">
    <Skeleton className="h-6 w-6 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-32" />
    </div>
    <div className="flex items-center space-x-2">
      <Skeleton className="h-5 w-12 rounded-lg" />
      <Skeleton className="h-3 w-8" />
    </div>
  </div>
);

export { ActivityItemSkeleton };
