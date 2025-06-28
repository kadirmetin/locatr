'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Battery, MapPin, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { deleteDeviceMutationFunction } from '@/lib/api/device.api';
import type { Device } from '@/lib/types/device.type';

import { useToast } from '@/hooks/use-toast';

import { useDialog } from '@/context/dialog-provider';

interface DeviceCardProps {
  device: Device;
}

const DeviceCard = ({ device }: DeviceCardProps) => {
  const { toast } = useToast();
  const { openDialog } = useDialog();
  const queryClient = useQueryClient();

  const { mutate: deleteDevice, isPending: isDeleting } = useMutation({
    mutationFn: deleteDeviceMutationFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast({
        title: 'Device deleted',
        description: 'The device has been successfully removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete device',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDeleteDevice = (deviceId: string) => {
    try {
      openDialog('confirmation', {
        title: 'Delete device',
        description: 'Are you sure you want to delete this device?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDestructive: true,
        onConfirmAction: async () => {
          await deleteDevice(deviceId);
        },
      });
    } catch (error) {
      toast({
        title: 'Failed to delete device',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-gray-400';
    if (level > 50) return 'text-green-500';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">{device.deviceName}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{device.deviceOS}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Last Location</Label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 mt-1 shrink-0 text-blue-500" />
                <span className="text-sm">
                  {device.lastLocation?.coordinates?.length === 2
                    ? `${device.lastLocation.coordinates[0]}, ${device.lastLocation.coordinates[1]}`
                    : 'Location unavailable'}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Last Updated</Label>
              <p className="mt-1 text-sm">
                {device.lastLocation?.timestamp
                  ? new Intl.DateTimeFormat(undefined, {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    }).format(new Date(device.lastLocation.timestamp))
                  : 'No time data'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Battery</Label>
              <div className="flex items-center gap-2 mt-1">
                <Battery className={`h-4 w-4 ${getBatteryColor(device.batteryLevel)}`} />
                <span className="text-sm">
                  {device.batteryLevel ? `${device.batteryLevel}%` : 'Unknown'}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Manufacturer & Model</Label>
              <p className="mt-1 text-sm">
                {device.deviceManufacturer} - {device.deviceModel}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t">
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-muted-foreground">ID: {device.deviceId}</div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteDevice(device.deviceId)}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete Device'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DeviceCard;
