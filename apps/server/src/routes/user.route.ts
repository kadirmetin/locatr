import { Router as ExpressRouter, Router } from "express";

import { authenticateJWT } from "../common/strategies/jwt.strategy";
import { userController } from "../modules/user.module";

const userRoutes: ExpressRouter = Router();

userRoutes.post("/upload-avatar", authenticateJWT, userController.uploadAvatar);
userRoutes.post("/edit-profile", authenticateJWT, userController.editProfile);
userRoutes.post(
  "/edit-notification-preferences",
  authenticateJWT,
  userController.editNotificationPreferences,
);

export default userRoutes;
