
import { signInWithEmailAndPassword } from "firebase/auth";
import type { DocumentData } from "firebase-admin/firestore";
import { collection, getDocs, QuerySnapshot } from "firebase/firestore";

import type { Actions } from "./$types.js";
import {auth, db} from "$lib/firebase/firebase.js";
import { adminAuth } from "$lib/server/admin.js";
import {redirect} from "@sveltejs/kit";

export const  load = async ({ locals }) => {
    if (locals.userSession) {
        throw redirect(303, '/dashboard')
    }
}



// export const actions: Actions = {
//   login: async ({ cookies, request }) => {
//     let data = await request.formData();
//     let email = data.get("email");
//     let password = data.get("password");
//     if (!email || !password) return { status: 400, body: "Bad Request" };
//     email = email.toString();
//     password = password.toString();
//     let user = await signInWithEmailAndPassword(auth, email, password);
//     // cookies.set("sessionid", await db.createSession(user), { path: "/" });
//     //console.log(user);
//     //console.log(await auth.currentUser?.getIdToken());
//     return { status: 200, body: user.user.email };
//   },
//   logout: async ({ cookies }) => {
//         try {
//             // Sign out the user
//             await auth.signOut()

//             // Redirect to the login page
//             return {
//                 status: 302,
//                 headers: {
//                     location: '/auth', // Redirect to the login page
//                 },
//             };
//         } catch (error) {
//             console.error('Error logging out:', error);
//             return {
//                 status: 500,
//                 body: 'Internal Server Error',
//             };
//         }
//     }
// };
