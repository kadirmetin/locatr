export type DeviceType = {
  deviceId: string;
  deviceName: string;
  deviceIcon: string;
  deviceOS: "Android" | "iOS" | "iPadOS" | "other";
  deviceManufacturer: string;
  deviceModel: string;
  isTracking?: boolean;
  lastLocation?: {
    type: "Point";
    coordinates: [number, number];
    timestamp: Date;
  };
  devicePreferences: {
    pushNotification?: boolean;
  };
};
