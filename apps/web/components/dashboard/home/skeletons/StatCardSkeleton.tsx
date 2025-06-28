import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StatCardSkeleton = () => {
  return (
    <Card className="flex items-center p-4">
      <div className="flex items-center space-x-4 w-full">
        <div className="rounded-full p-3 bg-muted animate-pulse">
          <div className="h-6 w-6 bg-muted-foreground/20 rounded" />
        </div>

        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </Card>
  );
};

export default StatCardSkeleton;
