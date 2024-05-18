import { storage } from "firebase-admin";

export const bucket = storage().bucket(process.env.BUCKET_NAME!);
