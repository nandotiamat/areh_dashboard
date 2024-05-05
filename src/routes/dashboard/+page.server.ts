import {getModels} from '$lib/server/firestore.js';

// load function for page.svelte, doesnt need this because we already fetch the models in +layout.server.ts
// export const load = async ({locals}) => {

//     const models = await getModels();

//     return {
//         email: locals.userSession?.email,
//         admin: locals.userSession?.admin,
//         models: models
//     }

// }