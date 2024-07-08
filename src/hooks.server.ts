import { adminAuth } from "$lib/server/firebase_admin.js";
import {auth} from "$lib/server/firebase_client.js";
import { redirect, type Handle } from "@sveltejs/kit";
import type {DecodedIdToken} from "firebase-admin/auth";

export const handle: Handle = async ({ event, resolve }) => {

    const session = event.cookies.get("session") ?? "";

    if (!session || session === "") {
        //console.info("No session found");
        event.locals.userSession = undefined;
    } else {
        let decodedClaims: DecodedIdToken | undefined = undefined;
        try {
            //decodedClaims = await adminAuth.verifyIdToken(session,false);
            decodedClaims = await adminAuth.verifySessionCookie(session, false);

        } catch (err) {
            console.error("Error verifying session cookie", err);
            event.locals.userSession = undefined;
        }
        if (!decodedClaims) {
            console.error("No decoded claims found");
            event.locals.userSession = undefined;
        } else {
            //console.info("User session verified");
            const { uid, email, admin} = decodedClaims;
            event.locals.userSession = { uid, email, admin};
        }
    }

    // if (event.url.pathname !== "/auth" && !event.locals.userSession) {
    //     throw redirect(303, "/auth");
    // }

    const publicPaths = ["/", "/auth", "/legal/cookie-policy", "/legal/privacy-policy"];
    if (!publicPaths.includes(event.url.pathname) && !event.locals.userSession) {
        throw redirect(303, "/auth");
    }

    if (event.url.pathname.startsWith('/dashboard')) {
        if (!event.locals.userSession) {
            console.log('access denied')
            throw redirect(303, '/auth');
        }
    }

    const result = await resolve(event, {
        transformPageChunk: ({ html }) => html,
    });
    return result;
};