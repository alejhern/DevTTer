import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.project_id,
      clientEmail: process.env.client_email,
      privateKey: process.env.private_key!.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
