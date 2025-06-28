import { Request, Response } from "express";

import { NotFoundException } from "../common/utils/catch-error";
import { HTTPSTATUS } from "../configs/http.config";
import SessionModel from "../database/models/session.model";
import { getLocationFromIp } from "../helpers/session.helper";
import { asyncHandler } from "../middlewares/asyncHandler";
import { SessionService } from "../services/session.service";

export class SessionController {
  private sessionService: SessionService;

  constructor(sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  public getAllSession = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?.id;
      const sessionId = req.sessionId;

      if (sessionId) {
        const ip =
          req.ip || (req.headers["x-forwarded-for"] as string) || "Unknown";

        const location = getLocationFromIp(ip);

        await SessionModel.findByIdAndUpdate(sessionId, {
          ip,
          location,
          lastActive: new Date(),
        });
      }

      const { sessions } = await this.sessionService.getAllSession(userId);

      const modifiedSessions = sessions.map((session) => ({
        ...session.toObject(),
        isCurrent: session.id === sessionId,
      }));

      return res.status(HTTPSTATUS.OK).json({
        message: "Retrieved all sessions successfully",
        sessions: modifiedSessions,
      });
    },
  );

  public getSession = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const sessionId = req.sessionId;

      if (!sessionId) throw new NotFoundException("Session ID not found.");

      const { user } = await this.sessionService.getSessionById(sessionId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Session retrieved successfully",
        user,
      });
    },
  );

  public deleteSession = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { sessionId } = req.body;
      const userId = req.user?.id;

      await this.sessionService.deleteSession(sessionId, userId);

      return res.status(HTTPSTATUS.OK).json({
        message: "Session remove successfully",
      });
    },
  );

  public deleteAllSessions = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { userId, currentSessionId } = req.body;

      await this.sessionService.deleteAllSessions(userId, currentSessionId);

      return res.status(HTTPSTATUS.OK).json({
        message: "All other sessions removed successfully",
      });
    },
  );
}
