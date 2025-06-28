import { ErrorCode } from "../common/enums/error-code.enum";
import { VerificationEnum } from "../common/enums/verification-code.enum";
import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from "../common/interfaces/auth.interface";
import { hashValue } from "../common/utils/bcrypt";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../common/utils/catch-error";
import {
  calculateExpirationDate,
  ONE_DAY_IN_MS,
} from "../common/utils/date-time";
import {
  refreshTokenSignOptions,
  RefreshTPayload,
  signJwtToken,
  verifyJwtToken,
} from "../common/utils/jwt";
import { config } from "../configs/app.config";
import DeviceModel from "../database/models/device.model";
import SessionModel from "../database/models/session.model";
import UserModel from "../database/models/user.model";
import VerificationCodeModel from "../database/models/verification.model";
import {
  checkRateLimit,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../helpers/auth.helper";

export class AuthService {
  public async register(registerData: RegisterDto) {
    const { firstName, lastName, email, password } = registerData;

    const existingUser = await UserModel.exists({ email });

    if (existingUser)
      throw new BadRequestException(
        "User already exits",
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
      );

    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password,
      devices: [],
      userPreferences: {
        enable2FA: false,
        emailNotification: true,
        pushNotification: true,
      },
    });

    await sendVerificationEmail(String(newUser._id));

    return {
      user: newUser,
    };
  }

  public async login(loginData: LoginDto) {
    const { email, password, userAgent, ip, clientApp, deviceId } = loginData;

    const user = await UserModel.findOne({ email });
    if (!user)
      throw new BadRequestException(
        "Invalid email or password",
        ErrorCode.AUTH_USER_NOT_FOUND,
      );

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      throw new BadRequestException(
        "Invalid email or password",
        ErrorCode.AUTH_USER_NOT_FOUND,
      );

    if (!user.isEmailVerified) {
      return {
        user: null,
        isEmailVerified: false,
        mfaRequired: false,
        accessToken: "",
        refreshToken: "",
      };
    }

    if (user.userPreferences.enable2FA) {
      return {
        user: null,
        mfaRequired: true,
        isEmailVerified: true,
        accessToken: "",
        refreshToken: "",
      };
    }

    const session = await SessionModel.create({
      userId: user._id,
      deviceId: deviceId,
      userAgent,
      ip,
      lastActive: new Date(),
      clientApp,
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
      mfaRequired: false,
      isEmailVerified: true,
    };
  }

  public async refreshToken(refreshToken: string) {
    const { payload, error } = verifyJwtToken<RefreshTPayload>(refreshToken, {
      secret: refreshTokenSignOptions.secret,
    });

    if (error || !payload) {
      throw new UnauthorizedException(
        `Invalid refresh token: ${error || "Payload is undefined"}`,
      );
    }

    const session = await SessionModel.findById(payload.sessionId);
    const now = Date.now();

    if (!session) {
      throw new NotFoundException("Session does not exist");
    }

    if (session.expiredAt.getTime() <= now) {
      throw new NotFoundException("Session expired");
    }

    const sessionRequireRefresh =
      session.expiredAt.getTime() - now <= ONE_DAY_IN_MS;

    if (sessionRequireRefresh) {
      session.expiredAt = calculateExpirationDate(
        config.JWT.REFRESH_EXPIRES_IN,
      );
      await session.save();
    }

    const newRefreshToken = sessionRequireRefresh
      ? signJwtToken(
          {
            sessionId: session._id,
          },
          refreshTokenSignOptions,
        )
      : undefined;

    const accessToken = signJwtToken({
      userId: session.userId,
      sessionId: session._id,
    });

    return {
      accessToken,
      newRefreshToken,
    };
  }

  public async resendVerificationCode(email: string) {
    const user = await UserModel.findOne(
      { email },
      { _id: 1, isEmailVerified: 1 },
    ).lean();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isEmailVerified) {
      throw new BadRequestException("Email already verified");
    }

    const userId = user._id.toString();

    await checkRateLimit(userId, VerificationEnum.EMAIL_VERIFICATION, 1); // 1 request per 3 minutes

    await sendVerificationEmail(userId);

    return { message: "Verification email sent successfully" };
  }

  public async verifyEmail(code: string) {
    const validCode = await VerificationCodeModel.findOne({
      code,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiresAt: { $gt: Date.now() },
    });

    if (!validCode) {
      throw new BadRequestException("Invalid or expired verification code");
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      validCode.userId,
      {
        isEmailVerified: true,
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found", ErrorCode.VALIDATION_ERROR);
    }

    await validCode.deleteOne();

    return {
      user: updatedUser,
    };
  }

  public async forgotPassword(email: string) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const maxAttempts = 2; // 2 attempts per 3 minutes

    await checkRateLimit(
      String(user._id),
      VerificationEnum.PASSWORD_RESET,
      maxAttempts,
    );

    await sendPasswordResetEmail(String(user._id));

    return;
  }

  public async resetPassword({ password, verificationCode }: ResetPasswordDto) {
    const validCode = await VerificationCodeModel.findOne({
      code: verificationCode,
      type: VerificationEnum.PASSWORD_RESET,
      expiresAt: { $gt: new Date() },
    });

    if (!validCode) {
      throw new NotFoundException("Invalid or expired verification code");
    }

    const hashedPassword = await hashValue(password);

    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
      password: hashedPassword,
    });

    if (!updatedUser) {
      throw new BadRequestException("Failed to reset password!");
    }

    await validCode.deleteOne();

    await SessionModel.deleteMany({
      userId: updatedUser._id,
    });

    return {
      user: updatedUser,
    };
  }

  public async logout(sessionId: string) {
    return await SessionModel.findByIdAndDelete(sessionId);
  }

  public async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) throw new BadRequestException("Invalid password");

    user.password = newPassword;
    await user.save();

    return;
  }

  public async changeEmail(userId: string, newEmail: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    user.email = newEmail;
    user.isEmailVerified = false;
    await user.save();

    await sendVerificationEmail(userId);

    return;
  }

  public async deleteAccount(userId: string) {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) throw new NotFoundException("User not found");

    await DeviceModel.deleteMany({ userId });

    await SessionModel.deleteMany({ userId });

    return deletedUser;
  }
}
