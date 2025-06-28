import { Battery, Clock, MapPin, Smartphone, Wifi } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils/cn';

import type { Activity } from './RecentActivitiesArea';

const ActivityItem = ({ activity, index }: { activity: Activity; index?: number }) => {
  const { deviceName, networkType, batteryLevel, coordinates, timestamp } = activity;
  const { latitude, longitude } = coordinates;
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600 dark:text-green-400';
    if (level > 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getItemBackground = (idx?: number) => {
    if (idx === undefined) return 'bg-card';
    return idx % 2 === 0 ? 'bg-card hover:bg-muted/30' : 'bg-muted/20 hover:bg-muted/40';
  };

  return (
    <div
      className={cn(
        'group relative rounded-lg border transition-all duration-200',
        'border-border/50 hover:border-border hover:shadow-sm',
        getItemBackground(index),
        'p-3 sm:p-4'
      )}
    >
      {/* Mobile Layout */}
      <div className="flex flex-col space-y-3 sm:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-2 dark:from-blue-900/50 dark:to-blue-800/50">
              <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm font-semibold leading-none">{deviceName}</p>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{time}</span>
          </div>
        </div>

        <div className="flex justify-start">
          <Badge variant="secondary" className="text-xs px-2 py-1 shadow-sm">
            <Wifi className="mr-1 h-3 w-3" />
            {networkType}
          </Badge>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-1 rounded-md bg-background/50 px-2 py-1">
            <Battery className={cn('h-3 w-3', getBatteryColor(batteryLevel))} />
            <span className={cn('text-xs font-medium', getBatteryColor(batteryLevel))}>
              Battery: {batteryLevel}%
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-background/50 px-2 py-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden items-center space-x-4 sm:flex">
        <div className="relative">
          <div className="rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-2 dark:from-blue-900/50 dark:to-blue-800/50">
            <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold leading-none">{deviceName}</p>
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 shadow-sm">
              <Wifi className="mr-1 h-3 w-3" />
              {networkType}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 rounded-md bg-background/50 px-2 py-1">
              <Battery className={cn('h-3 w-3', getBatteryColor(batteryLevel))} />
              <span className={cn('font-medium', getBatteryColor(batteryLevel))}>
                {batteryLevel}%
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-md bg-background/50 px-2 py-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-muted-foreground">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ActivityItem };
