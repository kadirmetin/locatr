import { UserDocument } from "../database/models/user.model";

declare global {
  namespace Express {
    interface User extends UserDocument {
      _dummy?: never;
    }
    interface Request {
      sessionId?: string;
    }
  }
}
