import { Socket } from "socket.io";

import { LocationDocument } from "../database/models/location.model";

export interface LocationData {
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
  batteryLevel: number;
  networkType?: "wifi" | "cellular" | "unknown";
  deviceId: string;
}

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  deviceId?: string;
  sessionId?: string;
}

export interface LocationResponse {
  message: string;
  locations?: LocationDocument[];
  data?: LocationDocument | LocationData | null;
  count?: number;
  source?: "cache" | "database";
}
