import { WebSocketServer } from "ws";
import { Admin } from "../model/admin.model";

const wss = new WebSocketServer({ port: 8000 });

// websocket
wss.on("connection", (socket) => {
  socket.on("message", () => {
    Admin.watch().on("change", (data) => {
      socket.send(JSON.stringify(data));
    });
  });
});

wss.on("error", (error) => {
  console.log(error);
});

export default wss;
