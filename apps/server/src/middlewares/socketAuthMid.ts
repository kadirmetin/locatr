import { Socket } from "socket.io";

import { UnauthorizedException } from "../common/utils/catch-error";
import { verifyJwtToken } from "../common/utils/jwt";
import DeviceModel from "../database/models/device.model";
import SessionModel from "../database/models/session.model";
import { parseCookies } from "../helpers/middleware.helper";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  deviceId?: string;
  sessionId?: string;
}

export const authenticateSocket = (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void,
) => {
  (async () => {
    try {
      let token: string | undefined;
      let deviceId: string | undefined;

      if (socket.handshake.auth.token) {
        token = socket.handshake.auth.token as string;
        deviceId = socket.handshake.auth.deviceId as string | undefined;
      } else {
        const cookies = parseCookies(socket.request.headers.cookie);
        if (cookies.accessToken) {
          token = cookies.accessToken;
        }
      }

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      const { payload, error } = verifyJwtToken(token);

      if (error || !payload) {
        return next(
          new UnauthorizedException(
            `Invalid token: ${error || "Payload is undefined"}`,
          ),
        );
      }

      socket.userId = payload.userId as string;

      if (deviceId) {
        const device = await DeviceModel.findOne({
          userId: socket.userId,
          deviceId: deviceId,
        });

        if (device) {
          socket.deviceId = deviceId;
          const session = await SessionModel.findOne({
            userId: socket.userId,
            deviceId: deviceId,
          });

          if (session) {
            socket.sessionId = session._id as string;
          }
        } else {
          return next(new UnauthorizedException("Invalid deviceId for user"));
        }
      }

      next();
    } catch (error) {
      next(
        new Error(
          `Authentication error: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  })();
};
