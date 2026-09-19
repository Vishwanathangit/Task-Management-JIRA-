import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from './env';

// Node.js module caching ensures this client is initialized once as a Singleton across the application.
const client = postgres(env.DATABASE_URL);

export const db = drizzle(client);
