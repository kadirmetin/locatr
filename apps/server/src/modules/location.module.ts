import { Server as SocketIOServer } from "socket.io";

import { LocationController } from "../controllers/location.controller";
import { LocationService } from "../services/location.service";

export let locationService: LocationService | null = null;
let locationController: LocationController | null = null;

export const initializeLocationModules = (io: SocketIOServer) => {
  locationService = new LocationService(io);
  locationController = new LocationController(locationService);
};

export const getLocationController = (): LocationController => {
  if (!locationController) {
    throw new Error(
      "Location modules are not initialized. Call initializeLocationModules(io) first.",
    );
  }
  return locationController;
};
