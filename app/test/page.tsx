"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { socket } from "@/socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function onHello(value: string) {
      console.log("Recieved from SERVER ::", value);
    }

    function onMessage(data: string) {
      console.log("Recieved from SERVER ::", data);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    socket.on("message2", (data) => {
      console.log("Recieved from SERVER ::", data);
      // Execute any command
    });
    socket.on("hello", (value) => {
      console.log("Recieved from SERVER ::", value);
      setTransport(value);
    });
  }, []);

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <Button onClick={() => socket.emit("hello", "world")}>Send</Button>
    </div>
  );
}
