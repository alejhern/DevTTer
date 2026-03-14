import type { Devit } from "@/types";

import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/firebase/admin";
import { deleteImage, uploadImage } from "@/lib/utils";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    // 1️⃣ Autenticación
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // 2️⃣ Obtener devit del FormData
    const formData = await request.formData();
    const devitField = formData.get("devit");

    if (typeof devitField !== "string") {
      return NextResponse.json(
        { message: "Devit data missing" },
        { status: 400 },
      );
    }

    let devit: Omit<Devit, "id" | "author" | "createdAt">;

    try {
      devit = JSON.parse(devitField) as Omit<
        Devit,
        "id" | "author" | "createdAt"
      >;
    } catch {
      return NextResponse.json(
        { message: "Invalid devit JSON" },
        { status: 400 },
      );
    }

    if (!devit.content.trim()) {
      return NextResponse.json(
        { message: "Devit content cannot be empty" },
        { status: 400 },
      );
    }
    // 3️⃣ Actualizar el devit
    const devitRef = adminDb.collection("devits").doc(id);
    const devitDoc = await devitRef.get();

    if (!devitDoc.exists) {
      return NextResponse.json({ message: "Devit not found" }, { status: 404 });
    }

    const existingDevit = devitDoc.data() as Devit;

    if (existingDevit.author !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 4️⃣ Manejar imagen
    let imageUrl: string | null | undefined = existingDevit.imageUrl;

    if (formData.has("image")) {
      // Si hay una nueva imagen, subirla y eliminar la anterior
      if (imageUrl) {
        await deleteImage(imageUrl);
      }
      const imageFile = formData.get("image");

      if (imageFile instanceof File) {
        imageUrl = await uploadImage(imageFile, id);
      } else {
        imageUrl = null; // Si se envía un valor pero no es un archivo, se asume que se quiere eliminar la imagen
      }
    }

    await devitRef.update({
      content: devit.content,
      code: devit.code,
      imageUrl: imageUrl || FieldValue.delete(),
    });

    return NextResponse.json(
      {
        message: "Devit updated successfully",
        id: devitRef.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating devit:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
