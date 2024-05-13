import "dotenv/config";
import express from "express";
import connectDB from "./config/db";
import secrets from "./config/secret";
import middleware from "./shared/middleware";
import routes from "./shared/routes";

const app = express();
const PORT = secrets.port;

// root route
app.get("/api/v1", (_, res, next) => {
  res.json({
    success: true,
    message: "Welcome To The API",
  });

  next();
});

// implement middleware
app.use(middleware);

// connect to database
connectDB();

// define routes
app.use("/api/v1", routes);

// listen to port
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app;
