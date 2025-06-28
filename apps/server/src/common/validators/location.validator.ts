import { LocationData } from "../../@types/location.type";

export interface LocationValidationResult {
  isValid: boolean;
  reason?: string;
  warning?: string;
}

export class LocationValidator {
  private static readonly MAX_ACCURACY = 100; // meters
  private static readonly MAX_AGE = 5 * 60 * 1000; // 5 minutes

  // Distance thresholds for different accuracy levels
  private static readonly DISTANCE_THRESHOLDS = {
    HIGH_ACCURACY: { accuracy: 10, distance: 2, time: 5000 },
    MEDIUM_ACCURACY: { accuracy: 50, distance: 3, time: 8000 },
    LOW_ACCURACY: { distance: 5, time: 10000 },
  };

  static validate(data: LocationData): LocationValidationResult {
    if (!data.coordinates) {
      return { isValid: false, reason: "Missing coordinates" };
    }

    const { latitude, longitude, accuracy } = data.coordinates;

    // Validate latitude/longitude
    if (latitude < -90 || latitude > 90) {
      return { isValid: false, reason: "Invalid latitude value" };
    }

    if (longitude < -180 || longitude > 180) {
      return { isValid: false, reason: "Invalid longitude value" };
    }

    // Check accuracy
    if (accuracy && accuracy > this.MAX_ACCURACY) {
      return { isValid: true, warning: "Location accuracy is low" };
    }

    // Check timestamp
    const now = Date.now();
    const locationTime = new Date(data.timestamp).getTime();
    const timeDiff = Math.abs(now - locationTime);

    if (timeDiff > this.MAX_AGE) {
      return { isValid: false, reason: "Location data too old" };
    }

    return { isValid: true };
  }

  static calculateDistance(
    coord1: { latitude: number; longitude: number },
    coord2: { latitude: number; longitude: number },
  ): number {
    const EARTH_RADIUS_METERS = 6371e3; // Earth's mean radius in meters

    // Convert latitudes and longitude differences from degrees to radians
    const lat1Rad = (coord1.latitude * Math.PI) / 180;
    const lat2Rad = (coord2.latitude * Math.PI) / 180;
    const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const deltaLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    // Haversine formula
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance
    return EARTH_RADIUS_METERS * c;
  }

  static shouldSaveLocation(
    cachedData: LocationData | undefined,
    newData: LocationData,
  ): boolean {
    if (!cachedData) return true; // Always save the first valid location

    const distance = this.calculateDistance(
      cachedData.coordinates,
      newData.coordinates,
    );

    const timeDiff =
      new Date(newData.timestamp).getTime() -
      new Date(cachedData.timestamp).getTime();

    // Always save if more than 1 minute has passed
    if (timeDiff > 60000) return true;

    // Determine threshold based on accuracy
    const accuracy = newData.coordinates.accuracy;
    let threshold;

    if (
      accuracy &&
      accuracy < this.DISTANCE_THRESHOLDS.HIGH_ACCURACY.accuracy
    ) {
      threshold = this.DISTANCE_THRESHOLDS.HIGH_ACCURACY;
    } else if (
      accuracy &&
      accuracy < this.DISTANCE_THRESHOLDS.MEDIUM_ACCURACY.accuracy
    ) {
      threshold = this.DISTANCE_THRESHOLDS.MEDIUM_ACCURACY;
    } else {
      threshold = this.DISTANCE_THRESHOLDS.LOW_ACCURACY;
    }

    // Skip if movement is minimal and time is short
    return !(distance < threshold.distance && timeDiff < threshold.time);
  }
}
