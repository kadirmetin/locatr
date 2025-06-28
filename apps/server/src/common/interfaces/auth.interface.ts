export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
  userAgent?: string;
  ip?: string;
  clientApp: string;
  deviceId?: string;
}

export interface ResetPasswordDto {
  password: string;
  verificationCode: string;
}
