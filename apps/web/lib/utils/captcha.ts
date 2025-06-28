type CaptchaSuccessResponse = {
  success: true;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
};

type CaptchaErrorResponse = {
  success: false;
  'error-codes': ErrorCodes[];
};

type CaptchaData = CaptchaSuccessResponse | CaptchaErrorResponse;

type ErrorCodes =
  | 'missing-input-secret'
  | 'invalid-input-secret'
  | 'missing-input-response'
  | 'invalid-input-response'
  | 'bad-request'
  | 'timeout-or-duplicate';

const CAPTCHA_API_URL = 'https://www.google.com/recaptcha/api/siteverify' as const;

export async function getCaptchaToken(action: string): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    if (typeof grecaptcha === 'undefined') {
      console.warn('reCAPTCHA not loaded');
      resolve(null);
      return;
    }

    grecaptcha.ready(async () => {
      try {
        const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;
        if (!siteKey) {
          console.warn('Captcha site key not found');
          resolve(null);
          return;
        }

        const token = await grecaptcha.execute(siteKey, {
          action,
        });
        resolve(token);
      } catch (error) {
        console.error('Failed to get captcha token:', error);
        resolve(null);
      }
    });
  });
}

export async function verifyCaptchaToken(token: string): Promise<CaptchaData | null> {
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Captcha secret key not found');
  }

  try {
    const url = new URL(CAPTCHA_API_URL);
    url.searchParams.set('secret', secretKey);
    url.searchParams.set('response', token);

    const body = url.searchParams.toString();
    const response = await fetch(CAPTCHA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!response.ok) {
      throw new Error(`Captcha verification failed: ${response.status}`);
    }

    const captchaData: CaptchaData = await response.json();
    return captchaData;
  } catch (error) {
    console.error('Captcha verification error:', error);
    return null;
  }
}
