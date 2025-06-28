import { Request, Response } from "express";

import { UnauthorizedException } from "../common/utils/catch-error";
import { HTTPSTATUS } from "../configs/http.config";
import { asyncHandler } from "../middlewares/asyncHandler";
import { LocationService } from "../services/location.service";

export class LocationController {
  private locationService: LocationService;

  constructor(locationService: LocationService) {
    this.locationService = locationService;
  }

  public getAllLocations = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedException("User not authorized");

      const { message, locations } =
        await this.locationService.getAllLocations(userId);

      return res.status(HTTPSTATUS.OK).json({
        message: message,
        locations: locations,
      });
    },
  );

  public getRecentActivities = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedException("User not authorized");

      const result = await this.locationService.getRecentActivities(userId);

      return res.status(HTTPSTATUS.OK).json(result);
    },
  );
}
