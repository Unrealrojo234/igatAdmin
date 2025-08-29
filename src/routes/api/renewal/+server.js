import { json } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase.js';

export async function POST({ request }) {
    try {
        // Parse the JSON body from the request
        const data = await request.json();

        // Process the data (e.g., save to database)
        console.log('Received data:', data);

        try {
            const record = await pb.collection('renewal').create(data);
            console.log(record);
        } catch (error) {
            console.log('Error ', error);
        }

        // Return a response
        return json(
            {
                success: true,
                message: 'Data received successfully',
                receivedData: data
            },
            { status: 201 }
        );
    } catch (error) {
        return json(
            {
                success: false,
                error: error.message
            },
            { status: 400 }
        );
    }
}
