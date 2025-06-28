import { VerificationEnum } from "../common/enums/verification-code.enum";
import {
  HttpException,
  InternalServerException,
  NotFoundException,
} from "../common/utils/catch-error";
import {
  anHourFromNow,
  fifteenMinutesFromNow,
} from "../common/utils/date-time";
import { config } from "../configs/app.config";
import { HTTPSTATUS } from "../configs/http.config";
import UserModel from "../database/models/user.model";
import VerificationCodeModel from "../database/models/verification.model";
import { sendEmail } from "../mailers/mailer";
import { passwordResetTemplate } from "../mailers/templates/password-reset.template";
import { verifyEmailTemplate } from "../mailers/templates/verify-email.template";

export const checkRateLimit = async (
  userId: string,
  type: VerificationEnum,
  maxAttempts: number,
  timeFrame: number = 3 * 60 * 1000, // 3 minutes
) => {
  const timeAgo = new Date(Date.now() - timeFrame);

  const count = await VerificationCodeModel.countDocuments({
    userId,
    type,
    createdAt: { $gt: timeAgo },
  });

  if (count >= maxAttempts) {
    throw new HttpException(
      "Too many requests, please try again later",
      HTTPSTATUS.TOO_MANY_REQUESTS,
    );
  }
};

export const sendVerificationEmail = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) throw new NotFoundException("User not found");

  const verification = await VerificationCodeModel.create({
    userId,
    type: VerificationEnum.EMAIL_VERIFICATION,
    expiresAt: fifteenMinutesFromNow(),
  });

  const verificationUrl = `${config.APP_ORIGIN}/auth/confirm-account?code=${verification.code}`;

  const { data, error } = await sendEmail({
    to: user.email,
    ...verifyEmailTemplate(verificationUrl),
  });

  if (!data?.id) {
    throw new InternalServerException(`${error?.name} ${error?.message}`);
  }

  return { message: "Verification email sent successfully" };
};

export const sendPasswordResetEmail = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) throw new NotFoundException("User not found");

  const expiresAt = anHourFromNow();

  const validCode = await VerificationCodeModel.create({
    userId: userId,
    type: VerificationEnum.PASSWORD_RESET,
    expiresAt,
  });

  const resetLink = `${config.APP_ORIGIN}/auth/reset-password?code=${
    validCode.code
  }&exp=${expiresAt.getTime()}`;

  const { data, error } = await sendEmail({
    to: user.email,
    ...passwordResetTemplate(resetLink),
  });

  if (!data?.id) {
    throw new InternalServerException(`${error?.name} ${error?.message}`);
  }

  return data.id;
};
