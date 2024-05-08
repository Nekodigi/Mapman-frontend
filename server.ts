import { createServer } from "node:http";

import next from "next";
import { Server } from "socket.io";
import { fs_a } from "./database/firestore";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("setAccount", async (data) => {
      console.log("Recieved from CLIENT ::", data);
      //need email, socket.id
      fs_a.doc(data.email).onSnapshot((doc) => {
        socket.emit("account", doc.data());
      });
    });
    // socket.broadcast.emit("hello", "world");
    // socket.on("hello", (data) => {
    //   console.log("Recieved from CLIENT ::", data);
    //   socket.emit("hello", "world");
    // });
    // console.log("Client connected");
    // socket.on("message1", (data) => {
    //   console.log("Recieved from API ::", data);
    //   io.emit("message2", data);
    // });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
