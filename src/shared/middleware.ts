import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import connectDB from "../config/db";
import { jwtAuthorization } from "../utils/jwt-auth";

const app = express();

//middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://ladies-sign-admin.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Origin",
      "Authorization",
      "Accept",
      "X-Requested-With",
      "Access-Control-Allow-Origin",
    ],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(jwtAuthorization); // jwt auth middleware

app.use((req, res, next) => {
  //TODO: add more strict authorization

  next();
});

// reconnect database
app.use((_, res, next) => {
  try {
    const mongoStatus = mongoose.connection.readyState;

    switch (mongoStatus) {
      case 0:
        connectDB();
      default:
        next();
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Sever ERROR",
    });
  }
});

export default app;
