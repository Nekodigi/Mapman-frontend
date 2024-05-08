import { firestore } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { accountConverter } from "./account";

//TODO FIX HOURS SINCE WE CAN'T USE ARRAY or USE CONVERTER

export const db = firestore();
if (!getApps().length) {
  initializeApp();
}

export const fs_a = db
  .collection("mapman")
  .doc("datas")
  .collection("accounts")
  .withConverter(accountConverter);
