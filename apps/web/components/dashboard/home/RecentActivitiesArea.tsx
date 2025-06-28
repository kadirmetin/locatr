import { Clock } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ActivityItem } from './ActivityItem';
import { ActivityItemSkeleton } from './skeletons/ActivityItemSkeleton';

export interface Activity {
  _id: string;
  deviceId: string;
  sessionId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  batteryLevel: number;
  networkType: string;
  deviceName: string;
  deviceIcon: string;
}

interface RecentActivitiesAreaProps {
  activities: Activity[];
  isLoading?: boolean;
}

const RecentActivitiesArea = ({ activities, isLoading = false }: RecentActivitiesAreaProps) => {
  const recent = activities.slice(0, 10);

  return (
    <Card className="flex-1">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          Recent Activities
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Latest location updates and device activities
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <ScrollArea className="h-64 sm:h-80">
          <div className="space-y-2 sm:space-y-4">
            {isLoading ? (
              Array.from({ length: recent.length || 6 }).map((_, idx) => (
                <ActivityItemSkeleton key={idx} />
              ))
            ) : recent.length > 0 ? (
              recent.map((activity) => <ActivityItem key={activity._id} activity={activity} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground font-medium">No recent activity</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  No device activity has been recorded yet.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesArea;
