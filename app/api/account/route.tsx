import { NextRequest } from "next/server";
import { fs_a } from "@/database/firestore";
import { makeid } from "@/utils/str";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get("email");
  if (!email) {
    return new Response("Missing email parameter", { status: 400 });
  }
  try {
    const account = await fs_a.doc(email as string).get();
    return Response.json(account.data());
  } catch (error) {
    console.log(error);
    return new Response("Error fetching account", { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  //recieve account as json
  const account = await req.json();
  if (!account) {
    return new Response("Missing account parameter", { status: 400 });
  }
  try {
    await fs_a.doc(account.email).set(account);
    //random 0 to 10 number
    let random = Math.floor(Math.random() * 10);
    fs_a.doc(`${account.email}-bu${random}`).set(account);
    return new Response("Account saved", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error saving account", { status: 500 });
  }
}
