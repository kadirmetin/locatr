import { z } from "zod";

const devicePreferencesSchema = z.object({
  pushNotification: z.boolean().optional().default(true),
});

export const addDeviceSchema = z.object({
  deviceId: z.string().min(1),
  deviceName: z.string().min(1),
  deviceIcon: z.string().min(1),
  deviceOS: z.enum(["Android", "iOS", "iPadOS", "other"]),
  deviceManufacturer: z.string().min(1),
  deviceModel: z.string().min(1),
  isTracking: z.boolean().default(false),
  devicePreferences: devicePreferencesSchema.default({}),
});

export const editDeviceSchema = z.object({
  deviceName: z.string().min(1),
  deviceIcon: z.string().min(1),
});
