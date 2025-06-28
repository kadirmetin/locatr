import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

interface UseLocationPermissionReturn {
  hasLocationPermission: boolean;
  isPermissionLoading: boolean;
  requestPermission: () => Promise<void>;
}

export const useLocationPermission = (): UseLocationPermissionReturn => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isPermissionLoading, setIsPermissionLoading] = useState(true);
  const permissionRequested = useRef(false);

  const requestPermission = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "We need location permission to use map features. Please enable location permission in settings.",
          [
            { text: "OK", style: "default" },
            {
              text: "Go to Settings",
              style: "default",
              onPress: () => Location.requestForegroundPermissionsAsync(),
            },
          ],
        );
        setHasLocationPermission(false);
        return;
      }

      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Alert.alert(
          "Location Services Disabled",
          "Your location services are disabled. Please enable location services in your device settings.",
          [{ text: "OK", style: "default" }],
        );
        setHasLocationPermission(false);
        return;
      }

      setHasLocationPermission(true);
    } catch (error) {
      console.error("Error requesting location permissions:", error);
      Alert.alert(
        "Error",
        "An error occurred while requesting location permission.",
        [{ text: "OK", style: "default" }],
      );
      setHasLocationPermission(false);
    } finally {
      setIsPermissionLoading(false);
    }
  };

  useEffect(() => {
    if (permissionRequested.current) return;

    permissionRequested.current = true;
    requestPermission();
  }, []);

  return {
    hasLocationPermission,
    isPermissionLoading,
    requestPermission,
  };
};
