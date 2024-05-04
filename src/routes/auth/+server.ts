import { signInWithEmailAndPassword } from "firebase/auth";
import type { DocumentData } from "firebase-admin/firestore";
import { collection, getDocs, QuerySnapshot } from "firebase/firestore";

import type { Actions } from "./$types.js";
import {auth, db} from "$lib/server/firebase_client.js";
import { adminAuth } from "$lib/server/firebase_admin.js";
import {redirect} from "@sveltejs/kit";

export async function POST({ request }: { request: Request }) {

    let data = await request.formData();
    let email = data.get("email");
    let password = data.get("password");
    if (!email || !password) return { status: 400, body: "Bad Request" };
    email = email.toString();
    password = password.toString();
    let userCredential = await signInWithEmailAndPassword(auth, email, password);

    let user = userCredential.user;
    let userIdToken = await user.getIdToken();
    console.log

    if (!user?.getIdToken) {
        console.info("No idToken found");
        throw redirect(303, "/auth");
    }

    const decodedClaims = await adminAuth.verifyIdToken(userIdToken);

    if (!decodedClaims || !decodedClaims.admin ) {
        console.log('Unauthorized access: User does not have admin role');
        // Handle unauthorized access
        return new Response("Forbidden", { status: 403 });
    }


    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const sessionCookie = await adminAuth.createSessionCookie(userIdToken, { expiresIn });
    console.log(sessionCookie)

    // try{
    //     await adminAuth.setCustomUserClaims(user.uid, {admin: true});

    // } catch (error) {

    //     console.error("Error setting custom claims:", error);
    //     return new Response("Error setting custom claims", {
    //         status: 500,
    //     });
    // }


    const options = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
    };

    const header = new Headers();
    header.append(
        "set-cookie",
        `session=${sessionCookie}; ${JSON.stringify(options)}`,
    );

    return new Response("auth", {
        status: 200,
        headers: header,
    });
}

export async function DELETE() {
    try {
        await auth.signOut();

        const header = new Headers();
        header.append("set-cookie", `session=; Max-Age=0`);
    
        return new Response("auth", {
            status: 200,
            headers: header,
        });
    } catch (error) {
        console.error("Error signing out:", error);
        return new Response("Error signing out", {
            status: 500,
        });
    }
}