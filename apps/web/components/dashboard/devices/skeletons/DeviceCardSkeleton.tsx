import { Battery } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const DeviceCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Skeleton className="h-6 w-48 mb-2" />
            <div className="flex items-center gap-2 mt-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Last Location</Label>
              <div className="flex items-start gap-2 mt-1">
                <Skeleton className="h-4 w-4 mt-1" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Last Updated</Label>
              <Skeleton className="h-5 w-40 mt-1" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Battery</Label>
              <div className="flex items-center gap-2 mt-1">
                <Battery className="h-4 w-4 text-gray-400" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Manufacturer & Model</Label>
              <Skeleton className="h-5 w-48 mt-1" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DeviceCardSkeleton;
