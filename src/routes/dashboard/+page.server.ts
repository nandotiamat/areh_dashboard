import { auth } from '$lib/firebase/firebase.js';
import {redirect} from '@sveltejs/kit';

export const load = async ({locals}) => {

    return {
        email: auth.currentUser?.email,
    }

}