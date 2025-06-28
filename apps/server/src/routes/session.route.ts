import { Router as ExpressRouter, Router } from "express";

import { sessionController } from "../modules/session.module";

const sessionRoutes: ExpressRouter = Router();

sessionRoutes.get("/all", sessionController.getAllSession);
sessionRoutes.get("/", sessionController.getSession);
sessionRoutes.delete("/deleteAll", sessionController.deleteAllSessions);
sessionRoutes.delete("/delete", sessionController.deleteSession);

export default sessionRoutes;
