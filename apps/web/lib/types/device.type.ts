export type Device = {
  deviceId: string;
  deviceName: string;
  deviceIcon: string;
  deviceOS: 'Android' | 'iOS' | 'iPadOS' | 'other';
  deviceManufacturer: string;
  deviceModel: string;
  isTracking?: boolean;
  lastLocation?: {
    type: 'Point';
    coordinates: [number, number];
    timestamp: Date;
  };
  batteryLevel?: number;
  devicePreferences: {
    pushNotification?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
};

export interface DeviceFilters {
  search: string;
  os: 'all' | 'Android' | 'iOS' | 'iPadOS';
  sortBy: 'name' | 'lastUpdated' | 'battery';
  sortOrder: 'asc' | 'desc';
}
