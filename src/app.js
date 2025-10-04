import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from "./routes/user.routes.js";
import imageRouter from "./routes/image.routes.js";

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/images", imageRouter); 

export { app };
