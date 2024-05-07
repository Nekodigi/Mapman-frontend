import { firestore } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { NextRequest } from "next/server";

import { Account } from "@/type/account";

//TODO FIX HOURS SINCE WE CAN'T USE ARRAY or USE CONVERTER

if (!getApps().length) {
  initializeApp();
}
const fs_a = firestore()
  .collection("mapman")
  .doc("datas")
  .collection("accounts");

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
    return new Response("Error fetching account", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  //recieve account as json
  const account = await req.json();
  if (!account) {
    return new Response("Missing account parameter", { status: 400 });
  }
  try {
    await fs_a.doc(account.email).withConverter(accountConverter).set(account);
    return new Response("Account saved", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error saving account", { status: 500 });
  }
}

//define converter
export const accountConverter = {
  toFirestore: (account: Account) => {
    account.profiles = account.profiles.map((profile) => {
      profile.locations = profile.locations.map((loc) => {
        if (loc.hours) {
          loc.hours = loc.hours.map((hour) => {
            return { open: hour[0], close: hour[1] };
          }) as any;
        }
        return loc;
      });
      return profile;
    }) as any;
    //console.log(account);
    return account;
  },
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data();
    data.profiles = data.profiles.map((profile: any) => {
      profile.locations = profile.locations.map((loc: any) => {
        if (loc.hours) {
          loc.hours = loc.hours.map((hour: any) => {
            return [hour.open, hour.close];
          }) as any;
        }
        return loc;
      });
      return profile;
    }) as any;
    return data;
  },
};
