import type { Comment } from "@/types";

import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/firebase/admin";

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

    // 2️⃣ Obtener comment del FormData
    const formData = await request.formData();
    const commentField = formData.get("comment");

    if (typeof commentField !== "string") {
      return NextResponse.json(
        { message: "Comment data missing" },
        { status: 400 },
      );
    }

    let comment: Omit<Comment, "id" | "author" | "createdAt">;

    try {
      comment = JSON.parse(commentField) as Omit<
        Comment,
        "id" | "author" | "createdAt"
      >;
    } catch {
      return NextResponse.json(
        { message: "Invalid comment JSON" },
        { status: 400 },
      );
    }

    if (!comment.comment.trim()) {
      return NextResponse.json(
        { message: "Comment cannot be empty" },
        { status: 400 },
      );
    }

    // 3️⃣ Crear el nuevo comentario
    const newComment = {
      id: `${id}-${Date.now()}`, // Generar un ID único para el comentario
      comment: comment.comment,
      author: userId,
      code: comment.code?.content.trim()
        ? {
            language: comment.code.language,
            content: comment.code.content,
          }
        : undefined,
      createdAt: FieldValue.serverTimestamp(),
    };

    // eliminar campo code undefined
    if (newComment["code"] === undefined) {
      delete newComment["code"];
    }

    // 4️⃣ Guardar en subcolección de comentarios
    await adminDb
      .collection("devits")
      .doc(id)
      .collection("comments")
      .add(newComment);

    return NextResponse.json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);

    return NextResponse.json(
      { message: "Failed to add comment" },
      { status: 500 },
    );
  }
}
