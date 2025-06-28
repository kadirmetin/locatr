import ImageKit from "imagekit";

import {
  InternalServerException,
  NotFoundException,
} from "../common/utils/catch-error";
import { config } from "../configs/app.config";
import UserModel from "../database/models/user.model";

const imagekit = new ImageKit({
  publicKey: config.IMAGEKIT.PUBLIC_KEY ?? "",
  urlEndpoint: config.IMAGEKIT.URL_ENDPOINT ?? "",
  privateKey: config.IMAGEKIT.PRIVATE_KEY ?? "",
});

export class UserService {
  public async findUserById(userId: string) {
    const user = await UserModel.findById(userId, { password: 0 });
    return user ?? null;
  }

  public async uploadAvatar(avatar: string, userId: string) {
    const user = await this.findUserById(userId);
    if (!user) throw new NotFoundException("User not found");

    try {
      const result = await imagekit.upload({
        file: avatar,
        fileName: `${user.firstName}_${user.lastName}_${Date.now()}_avatar`,
        extensions: [
          {
            name: "google-auto-tagging",
            maxTags: 5,
            minConfidence: 95,
          },
        ],
        isPublished: true,
      });

      user.avatar = result.url;

      await user.save();

      return result.url;
    } catch (error) {
      console.error("ImageKit Upload Error:", error);

      throw new InternalServerException(
        "An error occurred while uploading avatar",
      );
    }
  }

  public async editProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      bio?: string;
    },
  ) {
    const user = await this.findUserById(userId);
    if (!user) throw new NotFoundException("User not found");

    if (data.firstName !== undefined) user.firstName = data.firstName;
    if (data.lastName !== undefined) user.lastName = data.lastName;
    if (data.bio !== undefined) user.bio = data.bio;

    await user.save();

    return;
  }

  public async editNotificationPreferences(
    userId: string,
    notificationPreferences: {
      email?: boolean;
      push?: boolean;
    },
  ) {
    const user = await this.findUserById(userId);
    if (!user) throw new NotFoundException("User not found");

    if (notificationPreferences.email !== undefined)
      user.userPreferences.emailNotification = notificationPreferences.email;
    if (notificationPreferences.push !== undefined)
      user.userPreferences.pushNotification = notificationPreferences.push;

    await user.save();

    return;
  }
}
