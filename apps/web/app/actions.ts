'use server';

import { verifyCaptchaToken } from '@/lib/utils/captcha';

interface CaptchaActionResult {
  success: boolean;
  message: string;
  errors?: string[];
}

const MIN_CAPTCHA_SCORE = 0.5;
const SUSPICIOUS_SCORE_THRESHOLD = 0.3;

const ERROR_MESSAGES = {
  NO_TOKEN: 'Captcha token not found',
  VERIFICATION_FAILED: 'Captcha verification failed',
  LOW_SCORE: 'Captcha score too low - please try again',
  SUSPICIOUS_ACTIVITY: 'Suspicious activity detected',
} as const;

async function handleCaptcha(
  token: string | null,
  expectedAction: string
): Promise<CaptchaActionResult> {
  if (!token) {
    return { success: false, message: ERROR_MESSAGES.NO_TOKEN };
  }

  try {
    const captchaData = await verifyCaptchaToken(token);
    if (!captchaData) {
      return { success: false, message: ERROR_MESSAGES.VERIFICATION_FAILED };
    }

    if (!captchaData.success) {
      return {
        success: false,
        message: ERROR_MESSAGES.VERIFICATION_FAILED,
        errors: captchaData['error-codes'],
      };
    }

    if (captchaData.score < MIN_CAPTCHA_SCORE) {
      return { success: false, message: ERROR_MESSAGES.LOW_SCORE };
    }

    if (captchaData.score < SUSPICIOUS_SCORE_THRESHOLD) {
      return { success: false, message: ERROR_MESSAGES.SUSPICIOUS_ACTIVITY };
    }

    if (captchaData.action !== expectedAction) {
      console.warn(`Expected captcha action "${expectedAction}", but got "${captchaData.action}"`);
    }

    return { success: true, message: 'Captcha verified successfully' };
  } catch (error) {
    console.error(`Captcha verification error for action ${expectedAction}:`, error);
    return { success: false, message: ERROR_MESSAGES.VERIFICATION_FAILED };
  }
}

export async function forgotPasswordAction(token: string | null): Promise<CaptchaActionResult> {
  return await handleCaptcha(token, 'forgot_password');
}

export async function loginAction(token: string | null): Promise<CaptchaActionResult> {
  return await handleCaptcha(token, 'login');
}

export async function registerAction(token: string | null): Promise<CaptchaActionResult> {
  return await handleCaptcha(token, 'register');
}

export async function resetPasswordAction(token: string | null): Promise<CaptchaActionResult> {
  return await handleCaptcha(token, 'reset_password');
}

export async function resendVerificationEmailAction(
  token: string | null
): Promise<CaptchaActionResult> {
  return await handleCaptcha(token, 'resend_verification');
}
