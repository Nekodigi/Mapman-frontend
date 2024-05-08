import { firestore } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { accountConverter } from "./account";

//TODO FIX HOURS SINCE WE CAN'T USE ARRAY or USE CONVERTER

if (!getApps().length) {
  initializeApp();
}

export const db = firestore();

export const fs_a = db
  .collection("mapman")
  .doc("datas")
  .collection("accounts")
  .withConverter(accountConverter);
