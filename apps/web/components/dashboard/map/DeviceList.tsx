'use client';

import { useMemo } from 'react';

import { AlertTriangle, Smartphone } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils/cn';
import { getDeviceIcon } from '@/lib/utils/getDeviceIcon';

import type { LiveLocationUpdate } from '@/hooks/use-live-location-tracker';

interface ExtendedLiveLocationUpdate extends LiveLocationUpdate {
  deviceName?: string;
  deviceIcon?: string;
  batteryLevel?: number;
  isTracking?: boolean;
  isOnline?: boolean;
}

interface DeviceListProps {
  liveLocations: Map<string, ExtendedLiveLocationUpdate>;
  onSelectDevice: (deviceId: string) => void;
  selectedDeviceId: string | null;
}

const DeviceList = ({ liveLocations, onSelectDevice, selectedDeviceId }: DeviceListProps) => {
  const devices = useMemo(() => {
    return Array.from(liveLocations.values()).sort((a, b) => {
      if (a.isOnline && a.isTracking && (!b.isOnline || !b.isTracking)) return -1;
      if (b.isOnline && b.isTracking && (!a.isOnline || !a.isTracking)) return 1;
      if (a.isOnline && !b.isOnline) return -1;
      if (b.isOnline && !a.isOnline) return 1;
      return 0;
    });
  }, [liveLocations]);

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'bg-green-500';
    if (level > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getNetworkBadgeVariant = (networkType?: string) => {
    switch (networkType?.toUpperCase()) {
      case 'WIFI':
        return 'default';
      case 'CELLULAR':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg lg:text-xl">Your devices</CardTitle>
        <CardDescription className="text-sm">
          {devices.length} device{devices.length !== 1 ? 's' : ''} • Select to track
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 overflow-y-auto flex-grow p-4">
        {devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <Smartphone className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground text-center">
              No devices currently tracking or found.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {devices.map((deviceData) => {
              const batteryLevel = deviceData.location?.batteryLevel || deviceData.batteryLevel;
              const hasValidLocation =
                deviceData.location?.coordinates?.latitude &&
                deviceData.location?.coordinates?.longitude;
              const locationWarning = deviceData.location?.warning;

              return (
                <Card
                  key={deviceData.deviceId}
                  className={cn(
                    'cursor-pointer hover:bg-accent transition-colors border-2',
                    selectedDeviceId === deviceData.deviceId &&
                      'border-primary ring-2 ring-primary/20 bg-accent'
                  )}
                  onClick={() => onSelectDevice(deviceData.deviceId)}
                >
                  <CardHeader className="p-3 lg:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Device Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getDeviceIcon(deviceData.deviceIcon)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base lg:text-lg truncate">
                              {deviceData.deviceName || `Device ${deviceData.deviceId.slice(-4)}`}
                            </CardTitle>

                            {/* Online/Tracking Status */}
                            <div className="flex items-center gap-1">
                              {deviceData.isOnline && (
                                <div
                                  className={cn(
                                    'w-2 h-2 rounded-full',
                                    deviceData.isTracking
                                      ? 'bg-green-500 animate-pulse'
                                      : 'bg-blue-500'
                                  )}
                                  title={deviceData.isTracking ? 'Live tracking active' : 'Online'}
                                />
                              )}
                              {!deviceData.isOnline && (
                                <div className="w-2 h-2 bg-gray-400 rounded-full" title="Offline" />
                              )}
                            </div>
                          </div>

                          <CardDescription className="text-xs lg:text-sm">
                            {hasValidLocation ? (
                              <div className="space-y-1">
                                <div>
                                  Last Update:{' '}
                                  {new Date(deviceData.location.timestamp).toLocaleTimeString()}
                                </div>

                                {/* Location accuracy and warning */}
                                {deviceData.location.coordinates.accuracy && (
                                  <div className="text-xs text-muted-foreground">
                                    Accuracy: ±
                                    {Math.round(deviceData.location.coordinates.accuracy)}m
                                  </div>
                                )}

                                {locationWarning && (
                                  <div className="flex items-center gap-1 text-yellow-600">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span className="text-xs">{locationWarning}</span>
                                  </div>
                                )}

                                {/* Speed and heading info */}
                                {deviceData.location.coordinates.speed !== null &&
                                  deviceData.location.coordinates.speed !== undefined &&
                                  deviceData.location.coordinates.speed > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                      Speed:{' '}
                                      {(deviceData.location.coordinates.speed * 3.6) //mile to km/h
                                        .toFixed(1)}{' '}
                                      km/h
                                    </div>
                                  )}
                              </div>
                            ) : (
                              <div className="text-muted-foreground">
                                {deviceData.isOnline
                                  ? 'Waiting for location...'
                                  : 'No location data available'}
                              </div>
                            )}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Right side indicators */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {/* Network Type Badge */}
                        {deviceData.location?.networkType && (
                          <Badge
                            variant={getNetworkBadgeVariant(deviceData.location.networkType)}
                            className="text-xs"
                          >
                            {deviceData.location.networkType}
                          </Badge>
                        )}

                        {/* Battery Level Indicator */}
                        {batteryLevel !== null && batteryLevel !== undefined && (
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-3 border border-gray-300 rounded-sm relative bg-gray-100">
                              <div
                                className={cn(
                                  'h-full rounded-sm transition-all',
                                  getBatteryColor(batteryLevel)
                                )}
                                style={{
                                  width: `${Math.max(batteryLevel, 5)}%`,
                                }}
                              />
                            </div>
                            <div className="w-0.5 h-1 bg-gray-300 rounded-r-sm" />
                            <span className="text-xs text-muted-foreground ml-1">
                              {batteryLevel}%
                            </span>
                          </div>
                        )}

                        {/* Status Badge */}
                        <Badge
                          variant={
                            deviceData.isOnline
                              ? deviceData.isTracking
                                ? 'default'
                                : 'secondary'
                              : 'outline'
                          }
                          className="text-xs"
                        >
                          {deviceData.isOnline
                            ? deviceData.isTracking
                              ? 'Live'
                              : 'Online'
                            : 'Offline'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceList;
