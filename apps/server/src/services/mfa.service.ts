import { Request } from "express";
import qrcode from "qrcode";
import speakeasy from "speakeasy";

import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../common/utils/catch-error";
import { refreshTokenSignOptions, signJwtToken } from "../common/utils/jwt";
import SessionModel from "../database/models/session.model";
import UserModel from "../database/models/user.model";

export class MfaService {
  public async generateMFASetup(req: Request) {
    const user = req.user;
    if (!user) throw new UnauthorizedException("User not authorized");

    if (user.userPreferences.enable2FA) {
      return {
        message: "MFA already enabled",
      };
    }

    let secretKey = user.userPreferences.twoFactorSecret;
    if (!secretKey) {
      const secret = speakeasy.generateSecret({ name: "Locatr" });
      secretKey = secret.base32;
      user.userPreferences.twoFactorSecret = secretKey;
      await user.save();
    }

    const url = speakeasy.otpauthURL({
      secret: secretKey,
      label: `${user.firstName} ${user.lastName}`,
      issuer: "Locatr",
      encoding: "base32",
    });

    const qrImageUrl = await qrcode.toDataURL(url);

    return {
      message: "Scan the QR code or use the setup key.",
      secret: secretKey,
      qrImageUrl,
    };
  }

  public async verifyMFASetup(req: Request, code: string, secretKey: string) {
    const user = req.user;
    if (!user) throw new UnauthorizedException("User not authorized");

    if (user.userPreferences.enable2FA) {
      return {
        message: "MFA is already enabled",
        userPreferences: {
          enable2FA: user.userPreferences.enable2FA,
        },
      };
    }

    const isValid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: code,
    });

    if (!isValid) throw new BadRequestException("Invalid MFA code");

    user.userPreferences.enable2FA = true;

    await user.save();

    return {
      message: "MFA setup completed successfully",
      userPreferences: {
        enable2FA: user.userPreferences.enable2FA,
      },
    };
  }

  public async revokeMFA(req: Request) {
    const user = req.user;
    if (!user) throw new UnauthorizedException("User not authorized");

    if (!user.userPreferences.enable2FA)
      throw new BadRequestException("MFA is not enabled");

    user.userPreferences.twoFactorSecret = undefined;
    user.userPreferences.enable2FA = false;

    await user.save();

    return {
      message: "MFA revoke successfully",
      userPreferences: {
        enable2FA: user.userPreferences.enable2FA,
      },
    };
  }

  public async verifyMFAForLogin(LoginData: {
    code: string;
    email: string;
    userAgent?: string;
    ip?: string;
    clientApp: string;
    deviceId?: string;
  }) {
    const { code, email, ip, userAgent, clientApp, deviceId } = LoginData;

    const user = await UserModel.findOne({ email });
    if (!user) throw new NotFoundException("User not found");

    if (
      !user.userPreferences.enable2FA &&
      !user.userPreferences.twoFactorSecret
    ) {
      throw new BadRequestException("MFA not enabled for this user");
    }

    const isValid = speakeasy.totp.verify({
      secret: user.userPreferences.twoFactorSecret!,
      encoding: "base32",
      token: code,
    });

    if (!isValid)
      throw new BadRequestException("Invalid MFA code. Please try again.");

    const session = await SessionModel.create({
      userId: user._id,
      userAgent,
      ip,
      lastActive: new Date(),
      clientApp,
      deviceId,
    });

    const accessToken = signJwtToken({
      userId: user._id,
      sessionId: session._id,
    });

    const refreshToken = signJwtToken(
      {
        sessionId: session._id,
      },
      refreshTokenSignOptions,
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
