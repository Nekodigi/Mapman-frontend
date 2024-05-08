import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line import/no-named-as-default
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // do something you need to do in the backend
    // (like database operations, etc.)

    socket.emit("message1", "Sync Process Completed");

    return NextResponse.json({ data: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error }, { status: 200 });
  }
}
