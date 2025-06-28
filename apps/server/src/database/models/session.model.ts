import mongoose, { Document, Schema } from "mongoose";

import { thirtyDaysFromNow } from "../../common/utils/date-time";

export interface SessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  clientApp: "web" | "mobile";
  deviceId?: string;
  userAgent?: string;
  ip?: string;
  location?: string;
  lastActive?: Date;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<SessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientApp: {
      type: String,
      enum: ["web", "mobile"],
    },
    deviceId: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    ip: {
      type: String,
    },
    location: {
      type: String,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    expiredAt: {
      type: Date,
      required: true,
      default: thirtyDaysFromNow,
    },
  },
  {
    timestamps: true,
  },
);

sessionSchema.index({ userId: 1 });
sessionSchema.index({ deviceId: 1 });
sessionSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
