import { Router as ExpressRouter, Router } from "express";

import { authenticateJWT } from "../common/strategies/jwt.strategy";
import { getLocationController } from "../modules/location.module";

const locationRoutes: ExpressRouter = Router();
const controller = () => getLocationController();

locationRoutes.get("/get-all-locations", authenticateJWT, (req, res, next) => {
  controller().getAllLocations(req, res, next);
});

locationRoutes.get("/recent-activities", authenticateJWT, (req, res, next) => {
  controller().getRecentActivities(req, res, next);
});

export default locationRoutes;
