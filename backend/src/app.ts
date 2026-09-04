import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import notFound from "./middlewares/not-found.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

// Express APP
const app = express();

// App Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

// Error handlers (middlewares)
app.use(notFound);
app.use(errorHandler);

export default app;
