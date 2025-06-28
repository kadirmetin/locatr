import { Request, Response } from "express";

import {
  NotFoundException,
  UnauthorizedException,
} from "../common/utils/catch-error";
import { HTTPSTATUS } from "../configs/http.config";
import { asyncHandler } from "../middlewares/asyncHandler";
import { UserService } from "../services/user.service";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public uploadAvatar = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedException("User not authorized");

      const { avatar } = req.body;
      if (!avatar) throw new NotFoundException("Avatar not found");

      const url = await this.userService.uploadAvatar(avatar, userId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Avatar uploaded successfully",
        avatarUrl: url,
      });
    },
  );

  public editProfile = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedException("User not authorized");
      }

      const { firstName, lastName, bio } = req.body;

      await this.userService.editProfile(userId, { firstName, lastName, bio });

      return res.status(HTTPSTATUS.OK).json({
        message: "Profile edited successfully",
      });
    },
  );

  public editNotificationPreferences = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedException("User not authorized");
      }

      const { email, push } = req.body;

      await this.userService.editNotificationPreferences(userId, {
        email,
        push,
      });

      return res.status(HTTPSTATUS.OK).json({
        message: "Notification preferences edited successfully",
      });
    },
  );
}
