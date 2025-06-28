import { CookieOptions, Response } from "express";

import { config } from "../../configs/app.config";
import { calculateExpirationDate } from "./date-time";

interface CookiePayloadType {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production" ? true : false,
  sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  domain: config.NODE_ENV === "production" ? ".locatr.tech" : undefined,
};

export const getRefreshTokenCookieOptions = (): CookieOptions => {
  const expiresIn = config.JWT.REFRESH_EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);

  return {
    ...defaultCookieOptions,
    expires,
    path: "/",
  };
};

export const getAccessTokenCookieOptions = (): CookieOptions => {
  const expiresIn = config.JWT.EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);

  return {
    ...defaultCookieOptions,
    expires,
    path: "/",
  };
};

export const setAuthenticationCookies = ({
  res,
  accessToken,
  refreshToken,
}: CookiePayloadType): Response =>
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

export const clearAuthenticationCookies = (res: Response): Response =>
  res
    .clearCookie("accessToken", {
      path: "/",
      domain: config.NODE_ENV === "production" ? ".locatr.tech" : undefined,
      secure: config.NODE_ENV === "production" ? true : false,
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    })
    .clearCookie("refreshToken", {
      path: "/",
      domain: config.NODE_ENV === "production" ? ".locatr.tech" : undefined,
      secure: config.NODE_ENV === "production" ? true : false,
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    });
