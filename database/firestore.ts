import { config } from "dotenv";
config();

import { firestore } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { accountConverter } from "./account";

//TODO FIX HOURS SINCE WE CAN'T USE ARRAY or USE CONVERTER

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.SA_PROJECT_ID,
      clientEmail: process.env.SA_CLIENT_EMAIL,
      //privateKey: process.env.SA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      privateKey: process.env.SA_PRIVATE_KEY,
    }),
  });
  getFirestore().settings({ ignoreUndefinedProperties: true });
}

export const db = getFirestore();

export const fs_a = db
  .collection("mapman")
  .doc("datas")
  .collection("accounts")
  .withConverter(accountConverter);
