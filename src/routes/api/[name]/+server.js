import { pb } from '$lib/pocketbase.js';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const { name } = params;

	const options = ['news', 'upcoming_events', 'gallery', 'team'];

	if (!options.includes(name)) {
		return new Response(JSON.stringify({ message: 'Invalid option' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const data = await pb.collection(name).getFullList({
			sort: '-created'
		});

		console.log(data);

		return new Response(JSON.stringify({ data }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: 'Error fetching data',
				error: error.message
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
}
