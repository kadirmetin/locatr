import mongoose, { Document, Schema } from "mongoose";

import { compareValue, hashValue } from "../../common/utils/bcrypt";

interface UserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  pushNotification: boolean;
  twoFactorSecret?: string;
}

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  isEmailVerified: boolean;
  devices: mongoose.Types.ObjectId[];
  userPreferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(value: string): Promise<boolean>;
}

const userPreferencesSchema = new Schema<UserPreferences>(
  {
    enable2FA: { type: Boolean, default: false },
    emailNotification: { type: Boolean, default: true },
    pushNotification: { type: Boolean, default: true },
    twoFactorSecret: { type: String },
  },
  {
    _id: false,
  },
);

const userSchema = new Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    devices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Device",
      },
    ],
    userPreferences: {
      type: userPreferencesSchema,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashValue(this.password);
  }
  return next();
});

userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

userSchema.set("toJSON", {
  transform: function (_document, returnValue) {
    delete returnValue.password;
    return returnValue;
  },
});

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
