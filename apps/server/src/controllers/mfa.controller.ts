import { Request, Response } from "express";

import { setAuthenticationCookies } from "../common/utils/cookie";
import {
  verifyMFAForLoginSchema,
  verifyMFASchema,
} from "../common/validators/mfa.validator";
import { HTTPSTATUS } from "../configs/http.config";
import { asyncHandler } from "../middlewares/asyncHandler";
import { MfaService } from "../services/mfa.service";

export class MfaController {
  private mfaService: MfaService;

  constructor(mfaService: MfaService) {
    this.mfaService = mfaService;
  }

  public generateMFASetup = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { secret, qrImageUrl, message } =
        await this.mfaService.generateMFASetup(req);

      return res.status(HTTPSTATUS.OK).json({
        message,
        secret,
        qrImageUrl,
      });
    },
  );

  public verifyMFASetup = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { code, secretKey } = verifyMFASchema.parse({
        ...req.body,
      });

      const { userPreferences, message } = await this.mfaService.verifyMFASetup(
        req,
        code,
        secretKey,
      );

      return res.status(HTTPSTATUS.OK).json({
        message: message,
        userPreferences: userPreferences,
      });
    },
  );

  public revokeMFA = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { message, userPreferences } = await this.mfaService.revokeMFA(req);

      return res.status(HTTPSTATUS.OK).json({
        message,
        userPreferences,
      });
    },
  );

  public verifyMFAForLogin = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { code, email, deviceId } = req.body;
      const clientApp = req.headers["x-client-app"];
      const userAgent = req.headers["user-agent"];
      const ip =
        req.ip || (req.headers["x-forwarded-for"] as string) || "Unknown";

      const body = verifyMFAForLoginSchema.parse({
        code,
        email,
        ip,
        userAgent,
        clientApp,
        deviceId,
      });

      const { user, accessToken, refreshToken } =
        await this.mfaService.verifyMFAForLogin(body);

      return setAuthenticationCookies({
        res,
        accessToken,
        refreshToken,
      })
        .status(HTTPSTATUS.OK)
        .json({
          message: "Verified & login successfully",
          user,
          accessToken,
        });
    },
  );
}
