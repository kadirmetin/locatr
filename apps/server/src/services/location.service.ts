import { Types } from "mongoose";
import { Server as SocketIOServer } from "socket.io";

import { AuthenticatedSocket, LocationData } from "../@types/location.type";
import { NotFoundException } from "../common/utils/catch-error";
import { twentyFourHoursAgo } from "../common/utils/date-time";
import { LocationValidator } from "../common/validators/location.validator";
import DeviceModel from "../database/models/device.model";
import LocationModel, {
  LocationDocument,
} from "../database/models/location.model";
import UserModel from "../database/models/user.model";
import { authenticateSocket } from "../middlewares/socketAuthMid";

export class LocationService {
  private io: SocketIOServer;
  private activeConnections = new Map<string, AuthenticatedSocket>();
  private locationCache = new Map<string, LocationData>();
  private requestCounts = new Map<
    string,
    { count: number; lastReset: number }
  >();

  private onlineDevices = new Map<
    string,
    { deviceId: string; userId: string; lastSeen: Date; socketId: string }
  >();

  private readonly MAX_REQUESTS_PER_MINUTE = 60;
  private readonly RATE_LIMIT_WINDOW = 60000;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(authenticateSocket);
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket: AuthenticatedSocket) => {
      const { userId, deviceId } = socket;
      const isDashboard = Boolean(socket.handshake.auth.isDashboard);
      const userRoom = `tracking_${userId}`;

      if (!userId) {
        socket.disconnect(true);
        return;
      }

      if (isDashboard) {
        socket.join(userRoom);

        socket.emit("joined_dashboard", {
          message: "Connected as dashboard.",
        });

        (async () => {
          try {
            const devices = await DeviceModel.find({ userId }).lean();
            const initialData = await Promise.all(
              devices.map((d) => this.formatDeviceData(d.deviceId, userId)),
            );
            const valid = initialData.filter((d) => d);
            socket.emit("initial_locations", valid);
          } catch (err) {
            console.error(
              `(${userId}) Failed to load dashboard initial data:`,
              err,
            );
            socket.emit("location_error", {
              message: "Failed to load dashboard data.",
            });
          }
        })();

        return;
      }

      if (!deviceId) {
        socket.disconnect(true);
        return;
      }

      this.activeConnections.set(deviceId, socket);
      this.onlineDevices.set(deviceId, {
        deviceId,
        userId,
        lastSeen: new Date(),
        socketId: socket.id,
      });

      this.updateDeviceStatus(deviceId, { isTracking: true, isOnline: true });

      socket.join(userRoom);
      this.io.to(userRoom).emit("device_online", {
        deviceId,
        userId,
        timestamp: new Date(),
      });

      socket.emit("request_current_location");

      socket.on("location_update", (data: LocationData) => {
        this.handleLocationUpdate(socket, data).catch((error) => {
          console.error(`[${deviceId}] Location processing error:`, error);
          socket.emit("location_error", {
            message: "Server encountered an error processing location.",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        });
      });

      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private async formatDeviceData(deviceId: string, userId: string) {
    const device = await DeviceModel.findOne({ deviceId, userId }).lean();
    if (!device) return null;

    let lastLocation = null;
    if (device.lastLocation?.coordinates) {
      lastLocation = {
        coordinates: {
          latitude: device.lastLocation.coordinates[1],
          longitude: device.lastLocation.coordinates[0],
        },
        timestamp: device.lastLocation.timestamp,
        batteryLevel: device.batteryLevel,
        networkType: null,
      };
    }

    return {
      userId,
      deviceId,
      deviceName: device.deviceName,
      deviceIcon: device.deviceIcon,
      isTracking: device.isTracking,
      isOnline: this.onlineDevices.has(deviceId),
      location: lastLocation,
      batteryLevel: device.batteryLevel,
    };
  }

  private handleDisconnect(socket: AuthenticatedSocket) {
    const { userId, deviceId } = socket;
    if (!userId || !deviceId) return;

    this.activeConnections.delete(deviceId);
    this.onlineDevices.delete(deviceId);

    const cachedLocation = this.locationCache.get(deviceId);
    if (cachedLocation) {
      this.updateDeviceLastLocation(deviceId, cachedLocation);
      this.locationCache.delete(deviceId);
    }

    this.updateDeviceStatus(deviceId, { isTracking: false, isOnline: false });

    this.io
      .to(`tracking_${userId}`)
      .emit("device_offline", { deviceId, userId, timestamp: new Date() });
  }

  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userStats = this.requestCounts.get(userId);

    if (!userStats || now - userStats.lastReset > this.RATE_LIMIT_WINDOW) {
      this.requestCounts.set(userId, { count: 1, lastReset: now });
      return true;
    }

    if (userStats.count >= this.MAX_REQUESTS_PER_MINUTE) {
      return false;
    }

    userStats.count++;
    return true;
  }

  private async handleLocationUpdate(
    socket: AuthenticatedSocket,
    data: LocationData,
  ) {
    const { userId, deviceId, sessionId } = socket;

    if (!userId || !deviceId || !sessionId) {
      throw new Error(
        `Authentication details missing: userId=${userId}, deviceId=${deviceId}`,
      );
    }

    if (!this.checkRateLimit(userId)) {
      socket.emit("location_error", {
        message: "Too many requests. Please wait.",
      });
      return;
    }

    if (
      data.batteryLevel !== null &&
      (data.batteryLevel < 0 || data.batteryLevel > 100)
    ) {
      data.batteryLevel = data.batteryLevel < 0 ? 0 : 100;
    }

    const validation = LocationValidator.validate(data);
    if (!validation.isValid) {
      socket.emit("location_error", { message: validation.reason });
      return;
    }

    const cachedData = this.locationCache.get(deviceId);
    const shouldSave = LocationValidator.shouldSaveLocation(cachedData, data);

    let locationId = null;
    if (shouldSave || validation.warning) {
      const location = await this.saveLocation(userId, sessionId, data);
      locationId = location._id;
    }

    this.locationCache.set(deviceId, data);

    this.updateDeviceLastLocation(deviceId, data);

    this.io.to(`tracking_${userId}`).emit("location_updated", {
      userId,
      deviceId,
      isTracking: true,
      isOnline: true,
      location: {
        coordinates: data.coordinates,
        timestamp: data.timestamp,
        batteryLevel: data.batteryLevel,
        networkType: data.networkType,
        warning: validation.warning,
      },
    });

    socket.emit("location_saved", {
      timestamp: data.timestamp,
      saved: shouldSave || !!validation.warning,
      locationId,
      warning: validation.warning,
    });
  }

  private async saveLocation(
    userId: string,
    sessionId: string,
    data: LocationData,
  ): Promise<LocationDocument> {
    const location = new LocationModel({
      userId,
      deviceId: data.deviceId,
      sessionId,
      coordinates: {
        type: "Point",
        coordinates: [data.coordinates.longitude, data.coordinates.latitude],
        altitude: data.coordinates.altitude,
        accuracy: data.coordinates.accuracy,
        altitudeAccuracy: data.coordinates.altitudeAccuracy,
        heading: data.coordinates.heading,
        speed: data.coordinates.speed,
      },
      timestamp: data.timestamp,
      batteryLevel: data.batteryLevel,
      networkType: data.networkType,
      isActive: true,
    });

    return await location.save();
  }

  private async updateDeviceStatus(
    deviceId: string,
    status: { isTracking?: boolean; isOnline?: boolean },
  ) {
    await DeviceModel.updateOne({ deviceId }, { $set: status });
  }

  private async updateDeviceLastLocation(deviceId: string, data: LocationData) {
    await DeviceModel.updateOne(
      { deviceId },
      {
        $set: {
          lastLocation: {
            type: "Point",
            coordinates: [
              data.coordinates.longitude,
              data.coordinates.latitude,
            ],
            timestamp: data.timestamp,
          },
          batteryLevel: data.batteryLevel,
          lastSeen: new Date(),
        },
      },
    );
  }

  public async getAllLocations(userId: string) {
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const locations = await LocationModel.find({ userId }).lean();

    return {
      message: "Devices retrieved successfully",
      locations,
    };
  }

  public async getRecentActivities(userId: string) {
    const recentActivities = await LocationModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          timestamp: { $gte: twentyFourHoursAgo },
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "devices",
          localField: "deviceId",
          foreignField: "deviceId",
          as: "deviceInfo",
        },
      },
      {
        $unwind: {
          path: "$deviceInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          deviceId: 1,
          deviceName: "$deviceInfo.deviceName",
          deviceIcon: "$deviceInfo.deviceIcon",
          coordinates: {
            latitude: { $arrayElemAt: ["$coordinates.coordinates", 1] },
            longitude: { $arrayElemAt: ["$coordinates.coordinates", 0] },
            altitude: "$coordinates.altitude",
            accuracy: "$coordinates.accuracy",
            heading: "$coordinates.heading",
            speed: "$coordinates.speed",
          },
          timestamp: 1,
          batteryLevel: 1,
          networkType: 1,
          sessionId: 1,
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $limit: 1000,
      },
    ]);

    return {
      message: "Recent activities retrieved successfully",
      activities: recentActivities,
      count: recentActivities.length,
      timeRange: {
        from: twentyFourHoursAgo,
        to: new Date(),
      },
    };
  }
}
