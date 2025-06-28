import { NotFoundException } from "../common/utils/catch-error";
import SessionModel from "../database/models/session.model";

export class SessionService {
  public async getAllSession(userId: string) {
    const sessions = await SessionModel.find(
      {
        userId,
        expiredAt: { $gt: Date.now() },
        $or: [{ clientApp: { $ne: "mobile" } }],
      },
      {
        _id: 1,
        userId: 1,
        clientApp: 1,
        userAgent: 1,
        ip: 1,
        location: 1,
        createdAt: 1,
        expiredAt: 1,
        lastActive: 1,
      },
      {
        sort: { createdAt: -1 },
      },
    );

    return { sessions };
  }

  public async getSessionById(sessionId: string) {
    const session = await SessionModel.findById(sessionId)
      .populate("userId")
      .select("-expiredAt");

    if (!session) throw new NotFoundException("Session not found");

    const { userId: user } = session;

    return { user };
  }

  public async deleteSession(sessionId: string, userId: string) {
    const deletedSession = await SessionModel.findByIdAndDelete({
      _id: sessionId,
      userId: userId,
    });

    if (!deletedSession) throw new NotFoundException("Session not found");

    return;
  }

  public async deleteAllSessions(userId: string, currentSessionId: string) {
    const filter = {
      userId,
      _id: { $ne: currentSessionId },
      $or: [{ clientApp: { $ne: "mobile" } }],
    };

    const deletedResult = await SessionModel.deleteMany(filter);

    if (!deletedResult.deletedCount)
      throw new NotFoundException("No other sessions found to delete");
  }
}
