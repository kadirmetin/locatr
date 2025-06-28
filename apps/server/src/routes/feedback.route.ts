import { Router as ExpressRouter, Router } from "express";

import { authenticateJWT } from "../common/strategies/jwt.strategy";
import { feedbackController } from "../modules/feedback.module";

const feedbackRoutes: ExpressRouter = Router();

feedbackRoutes.post("/", authenticateJWT, feedbackController.createFeedback);

export default feedbackRoutes;
