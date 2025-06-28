export interface AddDeviceDto {
  userId: string;
  deviceId: string;
  deviceName: string;
  deviceIcon: string;
  deviceOS: "Android" | "iOS" | "iPadOS" | "other";
  deviceManufacturer: string;
  deviceModel: string;
  isTracking?: boolean;
  devicePreferences: {
    pushNotification?: boolean;
  };
}

export interface EditDeviceDto {
  userId: string;
  deviceId: string;
  deviceName: string;
  deviceIcon: string;
}
