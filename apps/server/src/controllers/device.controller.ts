import { Request, Response } from "express";

import {
  NotFoundException,
  UnauthorizedException,
} from "../common/utils/catch-error";
import {
  addDeviceSchema,
  editDeviceSchema,
} from "../common/validators/device.validator";
import { HTTPSTATUS } from "../configs/http.config";
import { asyncHandler } from "../middlewares/asyncHandler";
import { DeviceService } from "../services/device.service";

export class DeviceController {
  private deviceService: DeviceService;

  constructor(deviceService: DeviceService) {
    this.deviceService = deviceService;
  }

  public addDevice = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedException("User not authorized");

      const body = addDeviceSchema.parse(req.body);

      const { message, isNew } = await this.deviceService.addDevice({
        ...body,
        userId,
      });

      return res.status(HTTPSTATUS.OK).json({
        message: message,
        isNew: isNew,
      });
    },
  );

  public getDevice = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedException("User not authorized");

      const { deviceId } = req.params;
      if (!deviceId) throw new NotFoundException("Device id not found");

      const { message, device } = await this.deviceService.getDevice(
        userId,
        deviceId,
      );

      return res.status(HTTPSTATUS.OK).json({
        message: message,
        device: device,
      });
    },
  );

  public editDeviceInfo = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedException("User not authorized");

      const { deviceId } = req.params;
      const body = editDeviceSchema.parse(req.body);

      const { message, device } = await this.deviceService.editDeviceInfo({
        ...body,
        deviceId,
        userId,
      });

      return res.status(HTTPSTATUS.OK).json({
        message: message,
        device: device,
      });
    },
  );

  public getAllDevices = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedException("User not authorized");

      const { message, devices } =
        await this.deviceService.getAllDevices(userId);

      return res.status(HTTPSTATUS.OK).json({
        message: message,
        devices: devices,
      });
    },
  );

  public deleteDevice = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedException("User not authorized");

      const { deviceId } = req.params;
      if (!deviceId) throw new NotFoundException("Device id not found");

      const { message } = await this.deviceService.deleteDevice(
        userId,
        deviceId,
      );

      return res.status(HTTPSTATUS.OK).json({
        message: message,
      });
    },
  );

  public updateDeviceNotificationPreferences = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedException("User not authorized");

      const { deviceId } = req.params;
      if (!deviceId) throw new NotFoundException("Device id not found");

      const { message } =
        await this.deviceService.updateDeviceNotificationPreferences(
          userId,
          deviceId,
        );

      return res.status(HTTPSTATUS.OK).json({
        message: message,
      });
    },
  );
}
