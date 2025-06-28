export type Location = {
  coordinates: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
  };
  timestamp: Date;
  batteryLevel?: number;
  networkType?: 'wifi' | 'cellular' | 'unknown';
  deviceId: string;
};
