import { Router as ExpressRouter, Router } from "express";

import { authenticateJWT } from "../common/strategies/jwt.strategy";
import { authController } from "../modules/auth.module";

const authRoutes: ExpressRouter = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post(
  "/resend-verification-code",
  authController.resendVerificationCode,
);
authRoutes.post("/verify-email", authController.verifyEmail);
authRoutes.post("/forgot-password", authController.forgotPassword);
authRoutes.post("/reset-password", authController.resetPassword);
authRoutes.post("/logout", authenticateJWT, authController.logout);
authRoutes.get("/refresh", authController.refreshToken);
authRoutes.patch(
  "/change-password",
  authenticateJWT,
  authController.changePassword,
);
authRoutes.post("/change-email", authenticateJWT, authController.changeEmail);
authRoutes.delete(
  "/delete-account",
  authenticateJWT,
  authController.deleteAccount,
);

export default authRoutes;
