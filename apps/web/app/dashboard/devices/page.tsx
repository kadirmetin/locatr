'use client';

import { useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import DeviceCard from '@/components/dashboard/devices/DeviceCard';
import DeviceError from '@/components/dashboard/devices/DeviceError';
import DeviceFiltersComponent from '@/components/dashboard/devices/DeviceFilter';
import NoDevicesPlaceholder from '@/components/dashboard/devices/NoDevicesPlaceholder';
import DeviceCardSkeleton from '@/components/dashboard/devices/skeletons/DeviceCardSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { getAllDevicesQueryFunction } from '@/lib/api/device.api';
import type { Device, DeviceFilters } from '@/lib/types/device.type';

import { useDialog } from '@/context/dialog-provider';

const DevicesPage = () => {
  const { openDialog } = useDialog();
  const [filters, setFilters] = useState<DeviceFilters>({
    search: '',
    os: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const {
    data: devices,
    isLoading,
    error,
    refetch,
  } = useQuery<Device[]>({
    queryKey: ['devices'],
    queryFn: getAllDevicesQueryFunction,
  });

  const filteredAndSortedDevices = useMemo(() => {
    if (!devices) return [];

    const filtered = devices.filter((device) => {
      const matchesSearch =
        device.deviceName.toLowerCase().includes(filters.search.toLowerCase()) ||
        device.deviceManufacturer.toLowerCase().includes(filters.search.toLowerCase()) ||
        device.deviceModel.toLowerCase().includes(filters.search.toLowerCase());

      const matchesOS = filters.os === 'all' || device.deviceOS === filters.os;

      return matchesSearch && matchesOS;
    });

    // Sort devices
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.deviceName.toLowerCase();
          bValue = b.deviceName.toLowerCase();
          break;
        case 'lastUpdated':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'battery':
          aValue = a.batteryLevel || 0;
          bValue = b.batteryLevel || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [devices, filters]);

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4 pt-0">
        <DeviceError onRetry={() => refetch()} error={error.message} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Devices</CardTitle>
              <CardDescription>
                Monitor the location and status of devices linked to your account.
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                openDialog('addDevice', {});
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </div>
        </CardHeader>
      </Card>

      {!isLoading && devices && devices.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <DeviceFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              totalDevices={filteredAndSortedDevices.length}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <>
            <DeviceCardSkeleton />
            <DeviceCardSkeleton />
            <DeviceCardSkeleton />
          </>
        ) : !devices || devices.length === 0 ? (
          <NoDevicesPlaceholder />
        ) : filteredAndSortedDevices.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-semibold mb-2">No devices match your filters</h3>
              <p className="text-muted-foreground text-center mb-4">
                Try adjusting your search criteria or filters to find devices.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    search: '',
                    os: 'all',
                    sortBy: 'name',
                    sortOrder: 'asc',
                  })
                }
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid w-full flex-col gap-4 lg:w-3/4">
            {filteredAndSortedDevices.map((device) => (
              <DeviceCard key={device.deviceId} device={device} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevicesPage;
