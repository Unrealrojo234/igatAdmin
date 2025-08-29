import { Client, ID, TablesDB } from "appwrite";

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68af15170021aca37257');

export const tablesDB = new TablesDB(client);









