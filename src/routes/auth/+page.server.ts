import { db } from "$lib/firebase.js";
import { auth } from "$lib/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { DocumentData } from "firebase-admin/firestore";
import { collection, getDocs, QuerySnapshot } from "firebase/firestore";

import type { Actions } from "./$types.js";

export async function load() {
  const querySnapshot: QuerySnapshot = await getDocs(collection(db, "users"));
  const users: any[] = [];
  querySnapshot.docs.forEach((doc: DocumentData) => {
    users.push(doc.data().email);
  });
  console.log("this text is running on the server!");
  return { users: users };
}

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    let data = await request.formData();
    let email = data.get("email");
    let password = data.get("password");
    if (!email || !password) return { status: 400, body: "Bad Request" };
    email = email.toString();
    password = password.toString();
    let user = await signInWithEmailAndPassword(auth, email, password);
    // cookies.set("sessionid", await db.createSession(user), { path: "/" });
    console.log(user);
    return { status: 200, body: user.user.email };
  },
};
