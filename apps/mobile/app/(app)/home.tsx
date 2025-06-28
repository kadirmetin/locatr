import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { addDeviceMutationFunction } from "~/api/device.api";
import AppExitAlert from "~/components/AppExitAlert";
import Drawer from "~/components/home/Drawer";
import Map from "~/components/home/Map";
import { useAuthContext } from "~/context/auth-context";
import { useBatteryInfo } from "~/hooks/use-battery-info";
import { useDevice } from "~/hooks/use-device";
import { useLocationTracker } from "~/hooks/use-location-tracker";
import { getDeviceInfo } from "~/lib/getDeviceInfo";
import { useAppStore } from "~/stores/app-store";

const HomeScreen = () => {
  const { setLoading, setApiCallComplete, accessToken } = useAppStore();
  const { refetch } = useAuthContext();
  const { deviceId } = useDevice();

  const { mutateAsync: addDevice } = useMutation({
    mutationFn: addDeviceMutationFunction,
  });

  const {
    isTracking,
    error,
    warning,
    connectionStatus,
    startTracking,
    stopTracking,
  } = useLocationTracker(deviceId as string, accessToken as string);
  const batteryLevel = useBatteryInfo();

  useEffect(() => {
    const initializeDevice = async () => {
      if (!deviceId) return;

      setLoading(true);

      try {
        const deviceInfo = await getDeviceInfo();

        // Skip API call if device info is cached
        if (deviceInfo.isCached) {
          return;
        }

        const { isCached, ...deviceData } = deviceInfo;
        const response = await addDevice(deviceData);

        if (response.data.isNew) {
          refetch();
        }

        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      } catch (error) {
        console.error("Error initializing device:", error);
        ToastAndroid.show("Failed to initialize device", ToastAndroid.SHORT);
      } finally {
        setApiCallComplete(true);
      }
    };

    initializeDevice();
  }, [deviceId, addDevice, setApiCallComplete, setLoading, refetch]);

  const handleExit = useCallback(() => {
    BackHandler.exitApp();
  }, []);

  return (
    <SafeAreaView edges={["top"]} className="flex-1">
      <Map />

      <Drawer
        isTracking={isTracking}
        connectionStatus={connectionStatus}
        startTracking={startTracking}
        stopTracking={stopTracking}
        error={error as string}
        warning={warning as string}
        batteryLevel={batteryLevel?.level || null}
      />
      <AppExitAlert onExit={handleExit} />
    </SafeAreaView>
  );
};

export default HomeScreen;
