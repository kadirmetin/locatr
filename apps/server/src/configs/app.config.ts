import type { StringValue } from "ms";

import { getEnvironment } from "../common/utils/get-env";

const appConfig = () => {
  const config = {
    NODE_ENV: getEnvironment("NODE_ENV", "development"),
    APP_ORIGIN: getEnvironment("APP_ORIGIN", "localhost"),
    SERVER_PORT: getEnvironment("SERVER_PORT", "5000"),
    BASE_PATH: getEnvironment("BASE_PATH", "/api/v1"),
    MONGO_URI: getEnvironment("MONGO_URI"),
    JWT: {
      SECRET: getEnvironment("JWT_SECRET"),
      EXPIRES_IN: getEnvironment("JWT_EXPIRES_IN", "15m") as StringValue,
      REFRESH_SECRET: getEnvironment("JWT_REFRESH_SECRET"),
      REFRESH_EXPIRES_IN: getEnvironment(
        "JWT_REFRESH_EXPIRES_IN",
        "7d",
      ) as StringValue,
    },
    RESEND: {
      API_KEY: getEnvironment("RESEND_API_KEY"),
      SENDER: getEnvironment("RESEND_MAILER_SENDER"),
    },
    IMAGEKIT: {
      PUBLIC_KEY: getEnvironment("IMAGEKIT_PUBLIC_KEY"),
      URL_ENDPOINT: getEnvironment("IMAGEKIT_URL_ENDPOINT"),
      PRIVATE_KEY: getEnvironment("IMAGEKIT_PRIVATE_KEY"),
    },
    ADMIN_EMAIL: getEnvironment("ADMIN_EMAIL"),
  };

  return config;
};

export const config = appConfig();
