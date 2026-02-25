import type { Devit, User } from "@/types";

import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { storage } from "@/firebase/app";
import { adminDb, adminAuth } from "@/firebase/admin";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function uploadImage(devit: Devit, fileBuffer: Buffer): Promise<string> {
  const fileRef = ref(storage, `devit-images/${devit.id}`);

  if (fileBuffer.length > MAX_FILE_SIZE) {
    throw new Error("Image file must be less than 5MB");
  }

  const mimeType = fileBuffer.toString("utf8", 0, 12); // Check file signature

  if (!mimeType.includes("image")) {
    throw new Error("Only image files are allowed");
  }

  await uploadBytes(fileRef, fileBuffer);

  return getDownloadURL(fileRef);
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { message: "Content-Type must be multipart/form-data" },
        { status: 400 },
      );
    }

    // Parse multipart safely using Next.js Request API
    const formData = await req.formData();

    const devitField = formData.get("devit");

    if (typeof devitField !== "string") {
      return NextResponse.json(
        { message: "Devit data missing" },
        { status: 400 },
      );
    }

    let devitData: Devit;

    try {
      devitData = JSON.parse(devitField) as Devit;
    } catch {
      return NextResponse.json(
        { message: "Invalid devit JSON" },
        { status: 400 },
      );
    }

    // Optional image (expects form field name "image")
    const imageField = formData.get("image");
    let imageBuffer: Buffer | null = null;

    if (imageField instanceof File) {
      const arr = await imageField.arrayBuffer();

      imageBuffer = Buffer.from(arr);

      if (imageBuffer.length > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: "Image file must be less than 5MB" },
          { status: 400 },
        );
      }
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const currentUser: User = {
      id: decodedToken.uid,
      userName: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name || "Anonymous",
      avatar:
        decodedToken.picture || "https://www.gravatar.com/avatar?d=mp&s=200",
    };

    const imageUrl = imageBuffer
      ? await uploadImage(devitData, imageBuffer)
      : undefined;

    const devitToSave = {
      ...devitData,
      author: currentUser,
      imageUrl,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("devits").add(devitToSave);

    return NextResponse.json(
      { message: "Devit created", id: docRef.id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { message: error.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
