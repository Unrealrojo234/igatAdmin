import { PUBLIC_POCKET_BASE_URL } from '$env/static/public';

import PocketBase from 'pocketbase';

export const pb = new PocketBase(PUBLIC_POCKET_BASE_URL);
