import type { Devit, User } from "@/types";

import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { storage } from "@/firebase/app";
import { adminDb, adminAuth } from "@/firebase/admin";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function uploadImage(
  formData: FormData,
  idDevit: string,
): Promise<string> {
  const imageFile = formData.get("image");

  if (!(imageFile instanceof File)) {
    throw new Error("Invalid image file");
  }
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error("Image file must be less than 5MB");
  }

  if (!imageFile.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const storageRef = ref(storage, `devits/${idDevit}/${imageFile.name}`);

  await uploadBytes(storageRef, buffer, {
    contentType: imageFile.type,
  });

  return await getDownloadURL(storageRef);
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

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const currentUser: User = {
      id: decodedToken.uid,
      userName: devitData.author.userName,
      email: decodedToken.email || "",
      name: devitData.author.name || "Anonymous",
      avatar:
        devitData.author.avatar || "https://www.gravatar.com/avatar?d=mp&s=200",
    };

    const imageUrl = formData.has("image")
      ? await uploadImage(formData, devitData.id)
      : null;

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
