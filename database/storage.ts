import { storage } from "firebase-admin";

export const bucket = storage().bucket("your-bucket-name");
