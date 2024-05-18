import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { bucket } from "@/database/storage";
const pump = promisify(pipeline);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const account = formData.get("account") as string;
    const profile = formData.get("profile") as string;
    if (!file) {
      return NextResponse.json({ status: "fail", data: "No file uploaded" });
    }
    const fileName = `Mapman/${account}/${profile}/${new Date().toISOString()}_${file.name}`;
    const fileBuffer = await file.arrayBuffer();
    const blob = bucket.file(fileName);
    await blob.save(Buffer.from(fileBuffer), {
      resumable: false,
      metadata: {
        contentType: file.type,
      },
    });
    await blob.makePublic();
    const url = blob.publicUrl();
    console.log(url);
    return NextResponse.json({ status: "success", url: url });
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e });
  }
}
