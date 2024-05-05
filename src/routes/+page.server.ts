import {redirect} from "@sveltejs/kit"

export const  load = async ({ locals }) => {
    if (locals.userSession) {
        throw redirect(303, '/dashboard')
    }

}