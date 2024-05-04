import { auth } from '$lib/server/firebase_client.js';
import type {adminAuth} from '$lib/server/firebase_admin.js';
import {redirect} from '@sveltejs/kit';
import {getModels} from '$lib/server/firestore.js';

export const load = async ({locals}) => {

    const models = await getModels();

    return {
        email: locals.userSession?.email,
        admin: locals.userSession?.admin,
        models: models
    }

}