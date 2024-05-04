// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/** The user session, if any */
            userSession:
            | {
                uid: string;
                email: string | undefined;
				admin: boolean | undefined;
            }
            | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
