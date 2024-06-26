import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage,ref } from "firebase/storage";
import {
  FIREBASE_WEB_API_KEY,
  FIREBASE_WEB_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_WEB_APP_ID,
} from "$env/static/private";

const firebaseConfig = {
  apiKey: FIREBASE_WEB_API_KEY,
  authDomain: FIREBASE_WEB_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_WEB_APP_ID,
};

// Initialize Firebase
let firebaseApp;
if(!getApps().length){
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
  deleteApp(firebaseApp);
  firebaseApp = initializeApp(firebaseConfig);
}

export const app = firebaseApp;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const storageRef = ref(storage);
