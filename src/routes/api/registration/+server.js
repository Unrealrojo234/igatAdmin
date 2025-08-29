import { json } from '@sveltejs/kit';


import { ID, Client, TablesDB } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68af15170021aca37257');

const tablesDB = new TablesDB(client);


export async function POST({ request }) {
  try {
    const data = await request.json();
    
    console.log('Received data:', data);
    
    return json({
      success: true,
      message: 'Record received successfully',
      receivedData: data 
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return json({
      success: false,
      message: 'Failed to process request',
      error: error.message
    }, {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}