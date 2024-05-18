import { storage } from "firebase-admin";

import { cert, getApps, initializeApp } from "firebase-admin/app";

//TODO FIX HOURS SINCE WE CAN'T USE ARRAY or USE CONVERTER

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.SA_PROJECT_ID,
      clientEmail: process.env.SA_CLIENT_EMAIL,
      privateKey: process.env.SA_PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
    }),
  });
}

export const bucket = storage().bucket(process.env.BUCKET_NAME!);
