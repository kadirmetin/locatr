"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DeviceInfo from "react-native-device-info";

export interface BatteryInfo {
  level: number;
  isCharging: boolean;
}

export const useBatteryInfo = (refreshInterval: number = 10000) => {
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo | null>(null);
  const batteryRef = useRef<BatteryInfo | null>(null);

  const fetchBatteryData = useCallback(async () => {
    try {
      const batteryLevel = await DeviceInfo.getBatteryLevel();
      const isCharging = await DeviceInfo.isBatteryCharging();
      const info: BatteryInfo = {
        level: Math.floor(batteryLevel * 100),
        isCharging,
      };
      setBatteryInfo(info);
      batteryRef.current = info;
    } catch {
      setBatteryInfo(null);
      batteryRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchBatteryData();
    const id = setInterval(fetchBatteryData, refreshInterval);
    return () => clearInterval(id);
  }, [fetchBatteryData, refreshInterval]);

  return batteryInfo;
};
