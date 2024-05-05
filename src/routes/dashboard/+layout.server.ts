import {getModels} from "$lib/server/firestore.js";

//load function for layout.svelte
export const load = async ({locals}) => {

    const models = await getModels();

    return {
        email: locals.userSession?.email,
        admin: locals.userSession?.admin,
        models: models
    }

}
