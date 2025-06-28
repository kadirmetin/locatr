import mongoose, { Document, Schema } from "mongoose";

export interface LocationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: string;
  sessionId: mongoose.Types.ObjectId;
  coordinates: {
    type: "Point";
    coordinates: [number, number];
    altitude?: number;
    accuracy?: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
  };
  timestamp: Date;
  batteryLevel?: number;
  networkType?:
    | "wifi"
    | "cellular"
    | "unknown"
    | "WIFI"
    | "CELLULAR"
    | "UNKNOWN";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const coordinatesSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function (value: number[]) {
          return (
            Array.isArray(value) &&
            value.length === 2 &&
            value[0] >= -180 &&
            value[0] <= 180 && // longitude
            value[1] >= -90 &&
            value[1] <= 90 // latitude
          );
        },
        message: "Coordinates must be an array of [longitude, latitude]",
      },
    },
    altitude: {
      type: Number,
      default: null,
    },
    accuracy: {
      type: Number,
      default: null,
    },
    altitudeAccuracy: {
      type: Number,
      default: null,
    },
    heading: {
      type: Number,
      min: 0,
      max: 360,
      default: null,
    },
    speed: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  { _id: false },
);

const locationSchema = new Schema<LocationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },
    coordinates: {
      type: coordinatesSchema,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    networkType: {
      type: String,
      enum: ["wifi", "cellular", "unknown", "WIFI", "CELLULAR", "UNKNOWN"],
      default: "unknown",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes for efficient queries
locationSchema.index({ userId: 1, timestamp: -1 });
locationSchema.index({ deviceId: 1, timestamp: -1 });
locationSchema.index({ sessionId: 1, timestamp: -1 });
locationSchema.index({ userId: 1, deviceId: 1, timestamp: -1 });
locationSchema.index({ coordinates: "2dsphere" }); // For geospatial queries

// TTL index - optional: auto-delete old locations after certain period
// locationSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

const LocationModel = mongoose.model<LocationDocument>(
  "Location",
  locationSchema,
);

export default LocationModel;
