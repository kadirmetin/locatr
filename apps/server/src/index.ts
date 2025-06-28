import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { authenticateJWT } from "./common/strategies/jwt.strategy";
import { config } from "./configs/app.config";
import { HTTPSTATUS } from "./configs/http.config";
import connectDatabase from "./database/database";
import { asyncHandler } from "./middlewares/asyncHandler";
import { errorHandler } from "./middlewares/errorHandler";
import passport from "./middlewares/passport";
import { globalRateLimiter } from "./middlewares/rateLimiter";
import { initializeLocationModules } from "./modules/location.module";
import authRoutes from "./routes/auth.route";
import deviceRoutes from "./routes/device.route";
import feedbackRoutes from "./routes/feedback.route";
import locationRoutes from "./routes/location.route";
import mfaRoutes from "./routes/mfa.route";
import sessionRoutes from "./routes/session.route";
import userRoutes from "./routes/user.route";

const BASE_PATH = config.BASE_PATH;
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: config.APP_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  // Connection timeout settings
  pingTimeout: 60000,
  pingInterval: 25000,
  // Transport methods
  transports: ["websocket", "polling"],
});

initializeLocationModules(io);

app.use(
  express.json({
    limit: "4mb",
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.APP_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(globalRateLimiter);

app.get(
  "/",
  asyncHandler(async (_req: Request, res: Response): Promise<Response> => {
    return res.status(HTTPSTATUS.OK).json({
      message: "Hello World!",
    });
  }),
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/session`, authenticateJWT, sessionRoutes);
app.use(`${BASE_PATH}/mfa`, mfaRoutes);
app.use(`${BASE_PATH}/user`, userRoutes);
app.use(`${BASE_PATH}/device`, deviceRoutes);
app.use(`${BASE_PATH}/location`, locationRoutes);
app.use(`${BASE_PATH}/feedback`, feedbackRoutes);

app.use(errorHandler);

// Socket.IO connection monitoring
io.engine.on("connection_error", (err) => {
  console.log("Socket.IO connection error:", err.req);
  console.log("Error code:", err.code);
  console.log("Error message:", err.message);
  console.log("Error context:", err.context);
});

const startServer = async () => {
  try {
    await connectDatabase();

    server.listen(config.SERVER_PORT, () => {
      console.log(
        `🚀 Server listening on port ${config.SERVER_PORT} in ${config.NODE_ENV} mode`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
