import { Router as ExpressRouter, Router } from "express";

import { authenticateJWT } from "../common/strategies/jwt.strategy";
import { deviceController } from "../modules/device.module";

const deviceRoutes: ExpressRouter = Router();

deviceRoutes.post("/add-device", authenticateJWT, deviceController.addDevice);
deviceRoutes.get(
  "/get-device/:deviceId",
  authenticateJWT,
  deviceController.getDevice,
);
deviceRoutes.patch(
  "/edit-device-info/:deviceId",
  authenticateJWT,
  deviceController.editDeviceInfo,
);
deviceRoutes.get(
  "/get-all-devices",
  authenticateJWT,
  deviceController.getAllDevices,
);
deviceRoutes.delete(
  "/delete-device/:deviceId",
  authenticateJWT,
  deviceController.deleteDevice,
);
deviceRoutes.patch(
  "/update-notification-preferences/:deviceId",
  authenticateJWT,
  deviceController.updateDeviceNotificationPreferences,
);

export default deviceRoutes;
