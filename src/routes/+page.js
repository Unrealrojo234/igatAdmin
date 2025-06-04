// src/routes/protected/+page.server.ts
import { pb } from '$lib/pocketbase';

export async function load({ locals }) {
	let session = pb.authStore.isValid;

	return {
		user: session
	};
}
