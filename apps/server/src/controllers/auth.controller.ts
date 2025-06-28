import { Request, Response } from "express";

import {
  NotFoundException,
  UnauthorizedException,
} from "../common/utils/catch-error";
import {
  clearAuthenticationCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthenticationCookies,
} from "../common/utils/cookie";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resendVerificationCodeSchema,
  resetPasswordSchema,
  verificationEmailSchema,
} from "../common/validators/auth.validator";
import { HTTPSTATUS } from "../configs/http.config";
import { asyncHandler } from "../middlewares/asyncHandler";
import { AuthService } from "../services/auth.service";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const body = registerSchema.parse({
        ...req.body,
      });

      const { user } = await this.authService.register(body);

      return res.status(HTTPSTATUS.CREATED).json({
        message: "User registered successfully",
        data: user,
      });
    },
  );

  public login = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { email, password, deviceId } = req.body;
      const clientApp = req.headers["x-client-app"];
      const userAgent = req.headers["user-agent"];
      const ip =
        req.ip || (req.headers["x-forwarded-for"] as string) || "Unknown";

      const body = loginSchema.parse({
        email,
        password,
        userAgent,
        ip,
        clientApp,
        deviceId,
      });

      const { user, accessToken, refreshToken, mfaRequired, isEmailVerified } =
        await this.authService.login(body);

      if (!isEmailVerified) {
        return res.status(HTTPSTATUS.OK).json({
          message: "Email address is not verified",
          isEmailVerified: false,
          mfaRequired: false,
          data: {
            user: null,
          },
        });
      }

      if (mfaRequired) {
        return res.status(HTTPSTATUS.OK).json({
          message: "Verify MFA authentication",
          mfaRequired: true,
          isEmailVerified: true,
          data: {
            user,
          },
        });
      }

      return setAuthenticationCookies({ res, accessToken, refreshToken })
        .status(HTTPSTATUS.OK)
        .json({
          message: "User logged in successfully",
          mfaRequired: false,
          isEmailVerified: true,
          data: {
            user,
            accessToken,
          },
        });
    },
  );

  public refreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const refreshToken = req.cookies.refreshToken as string | undefined;
      if (!refreshToken)
        throw new UnauthorizedException("Missing refresh token");

      const { accessToken, newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      if (newRefreshToken) {
        res.cookie(
          "refreshToken",
          newRefreshToken ?? refreshToken,
          getRefreshTokenCookieOptions(),
        );
      }

      return res
        .status(HTTPSTATUS.OK)
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .json({
          message: "Refresh access token successfully",
          data: {
            accessToken,
          },
        });
    },
  );

  public resendVerificationCode = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { email } = resendVerificationCodeSchema.parse(req.body);

      await this.authService.resendVerificationCode(email);

      return res.status(HTTPSTATUS.OK).json({
        message: "Verification email sent",
      });
    },
  );

  public verifyEmail = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { code } = verificationEmailSchema.parse(req.body);

      await this.authService.verifyEmail(code);

      return res.status(HTTPSTATUS.OK).json({
        message: "Email verified successfully",
      });
    },
  );

  public forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const email = emailSchema.parse(req.body.email);
      await this.authService.forgotPassword(email);

      return res.status(HTTPSTATUS.OK).json({
        message: "Password reset email sent",
      });
    },
  );

  public resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const body = resetPasswordSchema.parse(req.body);

      await this.authService.resetPassword(body);

      return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
        message: "Reset password successfully",
      });
    },
  );

  public logout = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const sessionId = req.sessionId;

      if (!sessionId) {
        throw new NotFoundException("Session is invalid.");
      }

      await this.authService.logout(sessionId);

      return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
        message: "User logout successfully",
      });
    },
  );

  public changePassword = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { currentPassword, newPassword } = req.body;

      await this.authService.changePassword(
        req.user?.id,
        currentPassword,
        newPassword,
      );

      return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
        message: "Change password successfully",
      });
    },
  );

  public changeEmail = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { newEmail } = req.body;

      await this.authService.changeEmail(req.user?.id, newEmail);

      return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
        message: "Change email successfully",
      });
    },
  );

  public deleteAccount = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      await this.authService.deleteAccount(req.user?.id);

      return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).json({
        message: "Delete account successfully",
      });
    },
  );
}
