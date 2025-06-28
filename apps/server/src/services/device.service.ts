import { Types } from "mongoose";

import {
  AddDeviceDto,
  EditDeviceDto,
} from "../common/interfaces/device.interface";
import { NotFoundException } from "../common/utils/catch-error";
import DeviceModel from "../database/models/device.model";
import LocationModel from "../database/models/location.model";
import SessionModel from "../database/models/session.model";
import UserModel from "../database/models/user.model";

export class DeviceService {
  public async addDevice({
    deviceId,
    deviceName,
    deviceIcon,
    deviceOS,
    deviceManufacturer,
    deviceModel,
    isTracking,
    devicePreferences: { pushNotification },
    userId,
  }: AddDeviceDto) {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const existingDevice = await DeviceModel.findOne({
      userId,
      deviceId,
    });

    if (existingDevice) {
      return {
        isNew: false,
        message: "This device is already registered",
        device: existingDevice,
      };
    }

    const device = await DeviceModel.create({
      userId,
      deviceId,
      deviceName,
      deviceIcon,
      deviceOS,
      deviceManufacturer,
      deviceModel,
      isTracking,
      devicePreferences: {
        pushNotification,
      },
    });

    user.devices.push(device._id as Types.ObjectId);
    await user.save();

    return {
      isNew: true,
      message: "Device successfully added",
      device,
    };
  }

  public async getDevice(userId: string, deviceId: string) {
    const user = await UserModel.findById(userId).lean();
    if (!user) throw new NotFoundException(`User not found`);

    const existingDevice = await DeviceModel.findOne({
      userId,
      deviceId,
    }).lean();
    if (!existingDevice) throw new NotFoundException("Device not found");

    return {
      message: "Device retrieved successfully",
      device: existingDevice,
    };
  }

  public async editDeviceInfo({
    deviceName,
    deviceIcon,
    deviceId,
    userId,
  }: EditDeviceDto) {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const existingDevice = await DeviceModel.findOneAndUpdate(
      { userId, deviceId },
      { $set: { deviceName, deviceIcon } },
      { new: true, runValidators: true },
    ).lean();

    if (!existingDevice) {
      throw new NotFoundException("Device not found");
    }

    return {
      message: "Device updated successfully",
      device: existingDevice,
    };
  }

  public async getAllDevices(userId: string) {
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const devices = await DeviceModel.find({ userId }).lean();

    return {
      message: "Devices retrieved successfully",
      devices,
    };
  }

  public async deleteDevice(userId: string, deviceId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const existingDevice = await DeviceModel.findOneAndDelete({
      userId,
      deviceId,
    }).lean();

    if (!existingDevice) {
      throw new NotFoundException("Device not found");
    }

    if (existingDevice._id) {
      user.devices = user.devices.filter(
        (id) => id.toString() !== existingDevice._id.toString(),
      );
      await user.save();
    }

    await SessionModel.deleteMany({
      userId,
      deviceId,
      clientApp: "mobile",
    });

    await LocationModel.deleteMany({
      userId,
      deviceId,
    });

    return {
      message: "Device deleted successfully",
    };
  }

  public async updateDeviceNotificationPreferences(
    userId: string,
    deviceId: string,
  ) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const existingDevice = await DeviceModel.findOne({ userId, deviceId });
    if (!existingDevice) throw new NotFoundException("Device not found");

    existingDevice.devicePreferences.pushNotification =
      !existingDevice.devicePreferences.pushNotification;

    await existingDevice.save();

    return {
      message: "Device notification preferences updated successfully",
    };
  }
}
