import { io } from "socket.io-client";

export const socket = io("http://localhost:8080", {
  secure: true,
  rejectUnauthorized: false,
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("reconnect", () => {
  console.log("Reconnected to server");
});
