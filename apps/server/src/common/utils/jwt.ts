import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

import { config } from "../../configs/app.config";
import { SessionDocument } from "../../database/models/session.model";
import { UserDocument } from "../../database/models/user.model";

export interface AccessTPayload {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
}

export interface RefreshTPayload {
  sessionId: SessionDocument["_id"];
}

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ["user"] as [string, ...string[]],
};

export const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: config.JWT.EXPIRES_IN,
  secret: config.JWT.SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: config.JWT.REFRESH_EXPIRES_IN,
  secret: config.JWT.REFRESH_SECRET,
};

export const signJwtToken = (
  payload: AccessTPayload | RefreshTPayload,
  options?: SignOptionsAndSecret,
) => {
  const { secret, ...options_ } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...options_,
  });
};

export const verifyJwtToken = <TPayload extends object = AccessTPayload>(
  token: string,
  options?: VerifyOptions & { secret: string },
) => {
  try {
    const { secret = config.JWT.SECRET, ...options_ } = options || {};

    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...options_,
    } as VerifyOptions) as unknown as TPayload;

    return { payload };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : String(err),
    };
  }
};
