import * as Location from "expo-location";
import { useNetworkState } from "expo-network";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import { calculateDistance } from "~/lib/calculate-distance";
import { ConnectionStatus } from "~/lib/enums/ConnectionStatus";

import { useBatteryInfo } from "./use-battery-info";

interface LocationData {
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
  batteryLevel: number | null;
  networkType: string;
  deviceId: string;
}

interface LocationTrackerState {
  isTracking: boolean;
  isStarting: boolean;
  error: string | null;
  warning: string | null;
  connectionStatus: ConnectionStatus;
}

export const useLocationTracker = (deviceId?: string, token?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);
  const lastSentRef = useRef<LocationData | null>(null);

  const [state, setState] = useState<LocationTrackerState>({
    isTracking: false,
    isStarting: false,
    error: null,
    warning: null,
    connectionStatus: ConnectionStatus.Disconnected,
  });

  const networkState = useNetworkState();
  const batteryInfo = useBatteryInfo(5000);

  const updateState = useCallback((updates: Partial<LocationTrackerState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const sendLocationUpdate = useCallback(
    (location: Location.LocationObject, forceSend = false) => {
      const socket = socketRef.current;
      if (!socket?.connected || !deviceId) return;

      const info: LocationData = {
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude,
          accuracy: location.coords.accuracy,
          altitudeAccuracy: location.coords.altitudeAccuracy,
          heading: location.coords.heading,
          speed: location.coords.speed,
        },
        timestamp: new Date(location.timestamp),
        batteryLevel: batteryInfo?.level ?? null,
        networkType: networkState.type || "unknown",
        deviceId: deviceId,
      };

      if (!forceSend && lastSentRef.current) {
        const prev = lastSentRef.current;
        const dist = calculateDistance(prev.coordinates, info.coordinates);
        const dt = info.timestamp.getTime() - prev.timestamp.getTime();
        const accuracyImproved =
          info.coordinates.accuracy != null &&
          prev.coordinates.accuracy != null &&
          info.coordinates.accuracy < prev.coordinates.accuracy * 0.5;

        if (dist < 3 && dt < 15000 && !accuracyImproved) {
          return;
        }
      }

      socket.emit("location_update", info);
      lastSentRef.current = info;
    },
    [networkState.type, deviceId, batteryInfo],
  );

  const setupSocketListeners = useCallback(
    (socket: Socket) => {
      socket.on("connect", () => {
        updateState({
          error: null,
          connectionStatus: ConnectionStatus.Connected,
          isTracking: true,
        });
        lastSentRef.current = null;
      });

      socket.on("connect_error", (err) => {
        // Socket connection errors
        console.error("Socket connection error:", err.message);
        const isUnauthorized = err.message
          .toLowerCase()
          .includes("unauthorized");
        updateState({
          error: isUnauthorized
            ? `Unauthorized access`
            : `Connection failed: ${err.message}`,
          connectionStatus: isUnauthorized
            ? ConnectionStatus.Unauthorized
            : ConnectionStatus.Error,
          isTracking: false,
          isStarting: false,
        });
      });

      socket.on("unauthorized", (err) => {
        updateState({
          error: `Unauthorized: ${err?.message || "No permission"}`,
          connectionStatus: ConnectionStatus.Unauthorized,
          isTracking: false,
        });
        socket.disconnect();
      });

      socket.io.on("reconnect_attempt", () =>
        updateState({ connectionStatus: ConnectionStatus.Reconnecting }),
      );
      socket.io.on("reconnect", () =>
        updateState({
          connectionStatus: ConnectionStatus.Connected,
          error: null,
          isTracking: true,
        }),
      );
      socket.io.on("reconnect_failed", () => {
        updateState({
          error: "Reconnection failed permanently",
          connectionStatus: ConnectionStatus.Error,
          isTracking: false,
        });
      });
      socket.on("request_current_location", async () => {
        try {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
          sendLocationUpdate(loc, true);
        } catch (e) {
          // Errors when failing to get current location on request
          console.error("Failed to get current location on request:", e);
        }
      });

      socket.on(
        "location_saved",
        (data) => data.warning && updateState({ warning: data.warning }),
      );
      socket.on("location_error", (err) =>
        updateState({ error: err?.message || "Location processing error" }),
      );
      socket.on("disconnect", () =>
        updateState({
          connectionStatus: ConnectionStatus.Disconnected,
          isTracking: false,
        }),
      );
    },
    [sendLocationUpdate, updateState],
  );

  const startTracking = useCallback(async () => {
    if (state.isStarting || state.isTracking) return;

    updateState({ isStarting: true, error: null, warning: null });

    try {
      if (!deviceId || !token) {
        throw new Error("Device ID and token are required");
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        throw new Error("Location services disabled");
      }

      updateState({ connectionStatus: ConnectionStatus.Connecting });

      const socket = io(process.env.EXPO_PUBLIC_SOCKET_BASE_URL || "", {
        auth: { deviceId, token },
        transports: ["websocket"],
        timeout: 20000,
      });

      socketRef.current = socket;
      setupSocketListeners(socket);

      const initLoc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      sendLocationUpdate(initLoc, true);

      locationSubRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (loc) => sendLocationUpdate(loc),
      );

      updateState({ isTracking: true, error: null });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      // Errors when tracking fails to start
      console.error(`Failed to start tracking: ${errorMessage}`);
      updateState({
        error: `Failed to start: ${errorMessage}`,
        isTracking: false,
        connectionStatus: ConnectionStatus.Error,
      });
      socketRef.current?.disconnect();
      socketRef.current = null;
    } finally {
      updateState({ isStarting: false });
    }
  }, [
    state.isTracking,
    state.isStarting,
    deviceId,
    token,
    updateState,
    sendLocationUpdate,
    setupSocketListeners,
  ]);

  const stopTracking = useCallback(() => {
    locationSubRef.current?.remove();
    socketRef.current?.disconnect();

    locationSubRef.current = null;
    socketRef.current = null;
    lastSentRef.current = null;

    updateState({
      isTracking: false,
      isStarting: false,
      connectionStatus: ConnectionStatus.Disconnected,
      error: null,
    });
  }, [updateState]);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return { ...state, startTracking, stopTracking };
};
