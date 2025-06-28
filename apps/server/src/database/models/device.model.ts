import mongoose, { Document, Schema } from "mongoose";

interface DevicePreferences {
  pushNotification: boolean;
}

export interface DeviceDocument extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: string;
  deviceName: string;
  deviceIcon: string;
  deviceOS: "Android" | "iOS" | "iPadOS" | "other";
  deviceManufacturer: string;
  deviceModel: string;
  isTracking: boolean;
  lastLocation?: {
    type: "Point";
    coordinates: [number, number];
    timestamp: Date;
  };
  batteryLevel?: number;
  devicePreferences: DevicePreferences;
  createdAt: Date;
  updatedAt: Date;
}

const devicePreferencesSchema = new Schema<DevicePreferences>(
  {
    pushNotification: { type: Boolean, default: true },
  },
  {
    _id: false,
  },
);

const deviceSchema = new Schema<DeviceDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    deviceIcon: {
      type: String,
      required: true,
    },
    deviceOS: {
      type: String,
      enum: ["Android", "iOS", "iPadOS", "other"],
      default: "other",
    },
    deviceManufacturer: {
      type: String,
      required: true,
    },
    deviceModel: {
      type: String,
      required: true,
    },
    isTracking: {
      type: Boolean,
      default: false,
    },
    lastLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
      timestamp: Date,
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    devicePreferences: {
      type: devicePreferencesSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

deviceSchema.index({ userId: 1, deviceId: 1 }, { unique: true });
deviceSchema.index({ userId: 1, isTracking: 1 });

const DeviceModel = mongoose.model<DeviceDocument>("Device", deviceSchema);
export default DeviceModel;
