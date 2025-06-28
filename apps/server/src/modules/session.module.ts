import { SessionController } from "../controllers/session.controller";
import { SessionService } from "../services/session.service";

const sessionService = new SessionService();
const sessionController = new SessionController(sessionService);

export { sessionController, sessionService };
