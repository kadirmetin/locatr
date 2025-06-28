import { useCallback, useEffect, useState } from 'react';

import { socket } from '@/lib/socket';
import { parseDates } from '@/lib/utils/parseDates';

export interface LiveLocationUpdate {
  userId: string;
  deviceId: string;
  deviceName?: string;
  deviceIcon?: string;
  isTracking?: boolean;
  isOnline?: boolean;
  lastSeen?: Date;
  location: {
    coordinates: {
      latitude: number;
      longitude: number;
      altitude?: number | null;
      accuracy?: number | null;
      altitudeAccuracy?: number | null;
      heading?: number | null;
      speed?: number | null;
    };
    timestamp: Date;
    batteryLevel?: number | null;
    networkType?: string;
    warning?: string;
  };
}

interface DeviceStatusEvent {
  deviceId: string;
  userId: string;
  timestamp: Date;
}

interface UseLiveLocationTrackerState {
  liveLocations: Map<string, LiveLocationUpdate>;
  isConnected: boolean;
  error: string | null;
}

export const useLiveLocationTracker = (userId: string | undefined) => {
  const [state, setState] = useState<UseLiveLocationTrackerState>({
    liveLocations: new Map(),
    isConnected: false,
    error: null,
  });

  const setLiveLocations = useCallback(
    (updater: (prevMap: Map<string, LiveLocationUpdate>) => Map<string, LiveLocationUpdate>) => {
      setState((prevState) => ({
        ...prevState,
        liveLocations: updater(new Map(prevState.liveLocations)),
      }));
    },
    []
  );

  useEffect(() => {
    if (!userId) {
      if (socket.connected) socket.disconnect();
      setState({
        liveLocations: new Map(),
        isConnected: false,
        error: 'User ID is required for live tracking.',
      });
      return;
    }

    const onConnect = () =>
      setState((prevState) => ({ ...prevState, isConnected: true, error: null }));

    const onDisconnect = () => setState((prevState) => ({ ...prevState, isConnected: false }));

    const onConnectError = (err: Error) => {
      setState((prevState) => ({
        ...prevState,
        isConnected: false,
        error: `Connection error: ${err.message}`,
      }));
    };

    const onInitialLocations = (data: LiveLocationUpdate[]) => {
      setLiveLocations(() => {
        const initialMap = new Map<string, LiveLocationUpdate>();
        data.forEach((item) => {
          const parsedItem = parseDates(item);
          parsedItem.lastSeen = parsedItem.isOnline ? new Date() : parsedItem.location.timestamp;
          initialMap.set(parsedItem.deviceId, parsedItem);
        });
        return initialMap;
      });
    };

    const onLocationUpdated = (data: LiveLocationUpdate) => {
      setLiveLocations((prevMap) => {
        const parsedData = parseDates(data);
        const existingDevice = prevMap.get(parsedData.deviceId);

        const updatedDevice: LiveLocationUpdate = {
          ...(existingDevice || {}),
          ...parsedData,
          location: {
            ...(existingDevice?.location || {}),
            ...parsedData.location,
          },

          deviceName:
            parsedData.deviceName ||
            existingDevice?.deviceName ||
            `Device ${parsedData.deviceId.slice(-4)}`,
        };

        prevMap.set(parsedData.deviceId, updatedDevice);
        return prevMap;
      });
    };

    const onDeviceStatusUpdate = (deviceId: string, isOnline: boolean, timestamp: Date) => {
      setLiveLocations((prevMap) => {
        const device = prevMap.get(deviceId);

        if (device) {
          device.isOnline = isOnline;
          device.lastSeen = new Date(timestamp);
          prevMap.set(deviceId, device);
        } else {
          console.warn(`Received status update for an unknown device: ${deviceId}`);
        }
        return prevMap;
      });
    };

    const onDeviceOnline = (data: DeviceStatusEvent) =>
      onDeviceStatusUpdate(data.deviceId, true, data.timestamp);
    const onDeviceOffline = (data: DeviceStatusEvent) =>
      onDeviceStatusUpdate(data.deviceId, false, data.timestamp);

    if (!socket.connected) socket.connect();
    else onConnect();

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('initial_locations', onInitialLocations);
    socket.on('location_updated', onLocationUpdated);
    socket.on('device_online', onDeviceOnline);
    socket.on('device_offline', onDeviceOffline);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('initial_locations', onInitialLocations);
      socket.off('location_updated', onLocationUpdated);
      socket.off('device_online', onDeviceOnline);
      socket.off('device_offline', onDeviceOffline);
    };
  }, [userId, setLiveLocations]);

  return state;
};
