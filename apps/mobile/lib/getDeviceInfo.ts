import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { DeviceType } from "./types/device.type";

export type DeviceInfoWithCache = DeviceType & { isCached?: boolean };

const DEVICE_ID_KEY = "DEVICE_ID";
const DEVICE_INFO_KEY = "DEVICE_INFO";

const generateUUID = () => Crypto.randomUUID();

export const getPersistentDeviceId = async (): Promise<string | null> => {
  try {
    let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (deviceId) return deviceId;

    if (Platform.OS === "android") {
      deviceId = Application.getAndroidId();
      if (!deviceId) {
        deviceId = generateUUID();
      }
    } else {
      deviceId = generateUUID();
    }

    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
    return deviceId;
  } catch (err) {
    console.error("Error receiving persistent device ID: ", err);
    return null;
  }
};

export const deletePersistentDeviceId = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(DEVICE_ID_KEY);
  } catch (err) {
    console.error("Error deleting persistent device ID: ", err);
    throw new Error("Failed to delete persistent device ID");
  }
};

export const getDeviceInfo = async (): Promise<DeviceInfoWithCache> => {
  const cached = await AsyncStorage.getItem(DEVICE_INFO_KEY);
  if (cached) {
    return {
      isCached: true,
      ...JSON.parse(cached),
    };
  }

  const osName = Device.osName;
  let deviceOS: "Android" | "iOS" | "iPadOS" | "other";
  if (osName === "Android" || osName === "iOS" || osName === "iPadOS") {
    deviceOS = osName;
  } else {
    deviceOS = "other";
  }

  const deviceId = (await getPersistentDeviceId()) ?? "unknown-device-id";

  const info: DeviceType = {
    deviceId,
    deviceName: Device.deviceName ?? "Unknown",
    deviceIcon: "phone-portrait-outline",
    deviceOS,
    deviceManufacturer: Device.manufacturer ?? "Unknown",
    deviceModel: Device.modelName ?? Device.modelId ?? "Unknown",
    isTracking: false,
    devicePreferences: {
      pushNotification: true,
    },
  };

  await AsyncStorage.setItem(DEVICE_INFO_KEY, JSON.stringify(info));
  return {
    isCached: false,
    ...info,
  };
};

export const deleteDeviceInfo = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DEVICE_INFO_KEY);
  } catch (err) {
    console.error("Device info deletion error: ", err);
    throw new Error("Failed to delete device info");
  }
};
