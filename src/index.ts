import "dotenv/config";
import express from "express";
import http from "http"; // Import the http module
import connectDB from "./config/db";
import secrets from "./config/secret";
import middleware from "./shared/middleware";
import routes from "./shared/routes";
import wss from "./socket/message";

const app = express();
const server = http.createServer(app);

// port
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

// websocket
wss;

// listen to port
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app;
