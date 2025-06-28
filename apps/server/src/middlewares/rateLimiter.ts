import { NextFunction, Request, Response } from "express";
import rateLimit, { Options } from "express-rate-limit";

const WINDOW_MS = 60 * 1000; // 1 min
const MAX_REQUESTS_PER_WINDOW = 20; // max request per 1 min

export const globalRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS_PER_WINDOW,
  message: {
    message: `You have sent too many requests. Please try again after ${Math.ceil(WINDOW_MS / 1000)} seconds.`,
  },
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req: Request): string => {
    const userId = req.user?.id;
    return userId || req.ip;
  },

  handler: (
    _req: Request,
    res: Response,
    _next: NextFunction,
    options: Options,
  ) => {
    res.status(options.statusCode).json(options.message);
  },
});
