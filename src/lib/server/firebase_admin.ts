  import { getAuth } from "firebase-admin/auth";
  import { getFirestore } from "firebase-admin/firestore";
  import { getStorage } from "firebase-admin/storage"; // Import getStorage
  import {
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
  } from "$env/static/private";
  import pkg from "firebase-admin";

  try {
    pkg.initializeApp({
      credential: pkg.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      storageBucket: FIREBASE_STORAGE_BUCKET,
    });
  } catch (err: any) {
    if (!/already exists/u.test(err.message)) {
      console.error("Firebase Admin Error: ", err.stack);
    }
  }
  export const adminDB = getFirestore(pkg.app());
  export const adminAuth = getAuth(pkg.app());
  export const adminStorage = getStorage(pkg.app()); 
  export const adminBucket = adminStorage.bucket(); 
