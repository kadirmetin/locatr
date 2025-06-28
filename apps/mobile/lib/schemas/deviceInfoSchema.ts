import { Ionicons } from "@expo/vector-icons";
import { z } from "zod";

export type IoniconsName = keyof typeof Ionicons.glyphMap;

const iconSchema = z.custom<IoniconsName>(
  (val) => typeof val === "string" && val in Ionicons.glyphMap,
  {
    message: "Invalid icon selected",
  },
);

export const deviceInfoSchema = z.object({
  deviceName: z
    .string()
    .min(1, { message: "Device name is required" })
    .max(50, { message: "Device name must be less than 50 characters" })
    .trim(),
  deviceIcon: iconSchema,
});

export type DeviceInfoFormData = z.infer<typeof deviceInfoSchema>;
