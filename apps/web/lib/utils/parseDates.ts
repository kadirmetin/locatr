// Date strings to Date objects converter
import { LiveLocationUpdate } from '@/hooks/use-live-location-tracker';

const parseDates = (data: LiveLocationUpdate): LiveLocationUpdate => {
  if (data.location && typeof data.location.timestamp === 'string') {
    data.location.timestamp = new Date(data.location.timestamp);
  }

  if (data.lastSeen && typeof data.lastSeen === 'string') {
    data.lastSeen = new Date(data.lastSeen);
  }

  return data;
};

export { parseDates };
